import { config } from "dotenv";
import moduleAlias from "module-alias";
config({
  path: "../../.env",
});
moduleAlias(__dirname + "../../package.json");

import { PrismaClient } from ".prisma/client";
import fastifyAutoload from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import websocket from "@fastify/websocket";
import type { EvieUser } from "@prisma/client";
import { container } from "@sapphire/pieces";
import fastify, { FastifyInstance } from "fastify";
import { join } from "node:path";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Assistant } from "./modules/Assistant";
import { getNumberSecret, getSecret } from "./utils/env";

declare module "@sapphire/pieces" {
  interface Container {
    app: FastifyInstance;
    assistant: Assistant;
    prisma: PrismaClient;
  }
}

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PassportUser extends EvieUser {}
}

container.assistant = new Assistant();
container.prisma = new PrismaClient();

container.app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
});

const { app, prisma } = container;

app.register(fastifyCors, {
  origin: [getSecret("ORIGIN_URL"), /^http:\/\/localhost:\d+$/],
  credentials: true,
});

app.register(helmet);

app.register(fastifySecureSession, {
  key: Buffer.from(process.env.COOKIE_KEY as string, "hex"),
  cookie: {
    path: "/",
  },
});

app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());

const scopes = ["identify", "guilds"];

fastifyPassport.use(
  "discord",
  new DiscordStrategy(
    {
      clientID: getSecret("DISCORD_CLIENT_ID"),
      clientSecret: getSecret("DISCORD_SECRET"),
      callbackURL: getSecret("REDIRECT_URL"),
      scope: scopes,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await prisma.evieUser.upsert({
        where: {
          id: profile.id,
        },
        create: {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          fetchedAt: profile.fetchedAt,
          accessToken,
          refreshToken,
        },
        update: {
          username: profile.username,
          avatar: profile.avatar,
          fetchedAt: profile.fetchedAt,
          accessToken,
          refreshToken,
        },
      });

      if (user) {
        done(null, user);
      } else {
        done(null);
      }
    }
  )
);

fastifyPassport.registerUserSerializer(async (user: EvieUser) => user.id);
fastifyPassport.registerUserDeserializer(async (id: string) => {
  return await prisma.evieUser.findFirst({
    where: { id },
  });
});

app.register(websocket);

app.register(fastifyAutoload, {
  dir: join(__dirname, "./routes"),
});

app.listen(
  { port: getNumberSecret("PORT") ?? 3000, host: "0.0.0.0" },
  (err) => {
    if (err) {
      console.trace(err);
      process.exit(1);
    }
  }
);
