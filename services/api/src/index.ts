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
import { credentials } from "@grpc/grpc-js";
import type { EvieUser } from "@prisma/client";
import { container } from "@sapphire/pieces";
import fastify, { FastifyInstance } from "fastify";
import { join } from "node:path";
import { Strategy as DiscordStrategy } from "passport-discord";
import { GuildStoreClient } from "./lib/grpc";
import { Assistant } from "./modules/Assistant";
import { getNumberSecret, getSecret } from "./utils/env";

const PORT = getNumberSecret("PORT") ?? 3000;

declare module "@sapphire/pieces" {
  interface Container {
    app: FastifyInstance;
    assistant: Assistant;
    prisma: PrismaClient;
    guildStore: GuildStoreClient;
  }
}

declare module "fastify" {
  interface PassportUser extends EvieUser {
    id: string;
  }
}

const grpcConnection = `127.0.0.1:${
  getNumberSecret("guildStorePort") ?? "50051"
}`;
const grpcAuth = credentials.createInsecure();

container.assistant = new Assistant();
container.prisma = new PrismaClient();
container.guildStore = new GuildStoreClient(grpcConnection, grpcAuth);

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
      callbackURL:
        getSecret("DISCORD_CB", false) !== ""
          ? getSecret("DISCORD_CB")
          : `http://localhost:${PORT}/auth/callback`,
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
          guilds: profile.guilds as [],
        },
        update: {
          username: profile.username,
          avatar: profile.avatar,
          fetchedAt: profile.fetchedAt,
          accessToken,
          refreshToken,
          guilds: profile.guilds as [],
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

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.trace(err);
    process.exit(1);
  }
});
