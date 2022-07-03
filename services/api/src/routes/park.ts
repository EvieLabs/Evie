import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";

export default async function Router(fastify: FastifyInstance) {
  const { park } = container;
  fastify.get("/", { websocket: true }, (connection) => {
    connection.socket.on("message", (message) => {
      park.subscribe(parseInt(message.toString()), connection.socket);
    });
  });
}

export const autoPrefix = "/park";
