import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";

export default async function StatsRouter(fastify: FastifyInstance) {
  const { park } = container;
  fastify.get("/", async (_, res) => {
    const stats = await park.requestAll({
      r: "stats",
      n: park.generateNonce(),
    });
    return res.code(200).send(stats);
  });
}

export const autoPrefix = "/stats";
