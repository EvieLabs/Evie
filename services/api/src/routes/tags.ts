import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";
import { fetchGuild } from "../utils/grpcWrapper";

export default async function AuthRouter(fastify: FastifyInstance) {
	fastify.get<{
		Params: {
			slug: string;
		};
	}>("/", async (request, response) => {
		const slug = request.params.slug;
		if (!slug) return response.code(400).send({ error: "Missing slug" });

		const tag = await container.prisma.evieTag.findFirst({
			where: {
				online: true,
				slug,
			},
		});

		if (!tag || !tag.guildId) return response.code(404).send({ error: "Tag not found" });

		const guild = await fetchGuild(tag.guildId);

		return response.send({
			name: tag.name,
			content: tag.content,
			link: tag.link,
			guildName: guild.name,
		});
	});
}

export const autoPrefix = "/tags/:slug";
