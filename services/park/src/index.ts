import { config } from "dotenv";
import moduleAlias from "module-alias";
config({
  path: "../../.env",
});
moduleAlias(__dirname + "../../package.json");

import fastifyAutoload from "@fastify/autoload";
import { container } from "@sapphire/pieces";
import { getNumberSecret } from "environment";
import fastify, { FastifyInstance } from "fastify";
import { join } from "path";
import Park from "./Park";

container.park = new Park();
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
const { app } = container;

app.get("/", (_, res) => {
  res.send(`I'm alive! ${new Date()}`);
});

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

declare module "@sapphire/pieces" {
  interface Container {
    app: FastifyInstance;
    park: Park;
  }
}
