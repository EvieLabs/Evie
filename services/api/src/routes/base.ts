import type { FastifyInstance } from "fastify";

export default function Router(fastify: FastifyInstance) {
	fastify.get("/", async (_, res) => res.redirect("https://evie.pw"));
}

export const autoPrefix = "/";
