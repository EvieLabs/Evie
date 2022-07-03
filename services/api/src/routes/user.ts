import type { FastifyInstance } from "fastify";

export default async function UserRouter(fastify: FastifyInstance) {
  fastify.get(
    "/@me",

    async (request, reply) => {
      const user = request.user;

      if (!user) {
        return reply.code(401).send({
          message: "Unauthorized, no session.",
          session: request.user,
        });
      }

      return reply.code(200).send(user);
    }
  );
}

export const autoPrefix = "/user";
