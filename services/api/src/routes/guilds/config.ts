import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";
import { canManageGuild } from "../../utils/perms";

export default async function AuthRouter(fastify: FastifyInstance) {
  fastify.get<{
    Params: {
      id: string;
    };
  }>("/config", async (request, reply) => {
    const user = request.user;

    if (!user || !(await canManageGuild(user.id, request.params.id))) {
      return reply.code(401).send({
        message: "Unauthorized.",
      });
    }

    const config = await container.prisma.guildSettings.findFirst({
      where: {
        id: request.params.id,
      },
    });

    return reply.code(200).send(config);
  });
}

export const autoPrefix = "/guilds/:id";
