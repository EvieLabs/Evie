import type { FastifyInstance } from "fastify";
import { Minecraft } from "../../modules/Minecraft";

export default async function MinecraftRouter(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      lines: string[];
    };
  }>("/motd", async (req, res) => {
    const { lines } = req.body;
    if (!lines) return res.code(400).send("No lines provided.");

    try {
      const image = await Minecraft.renderMotd(lines);
      return await res.status(200).header("Content-Type", "image/png").send(image);
    } catch (e) {
      throw e;
    }
  });
}

export const autoPrefix = "/private/minecraft";
