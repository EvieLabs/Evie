import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";

export default async function StatsRouter(fastify: FastifyInstance) {
  const { prisma } = container;
  fastify.get("/", async (_, res) => {
    const shardStats = await prisma.shardStats.findMany();

    return res.code(200).send(shardStats);
  });
}

export const autoPrefix = "/stats";
