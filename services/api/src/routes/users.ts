import type { FastifyInstance } from "fastify";

export default function UserRouter(fastify: FastifyInstance) {
	fastify.get(
		"/@me",

		async (request, reply) => {
			const user = request.user;

			if (!user) {
				return reply.code(401).send({
					message: "Unauthorized, no session.",
				});
			}

			return reply.code(200).send(user);
		},
	);
}

export const autoPrefix = "/users";
