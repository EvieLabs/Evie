import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";
import { Stats } from "../modules/Stats";

export default async function StatsRouter(fastify: FastifyInstance) {
	const { prisma } = container;
	fastify.get<{
		Querystring: {
			avg?: string;
		};
	}>("/", async (req, res) => {
		const stats =
			req.query.avg === "true" || !req.query.avg ? await Stats.getStats() : await prisma.shardStats.findMany();

		return res.code(200).send(stats);
	});

	fastify.get(".png", async (_, res) => {
		try {
			const image = await Stats.renderStats();
			return await res.status(200).header("Content-Type", "image/png").send(image);
		} catch (e) {
			throw e;
		}
	});
}

export const autoPrefix = "/stats";
