import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";

const { park } = container;
export default async function GoogleAssistantRouter(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      query: string;
    };
  }>("/ask", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.code(400).send("No query provided.");

    try {
      const { image, audio } = await park.assistant.ask(query);
      return res.status(200).send({
        image,
        audio: audio || null,
      });
    } catch (e) {
      throw e;
    }
  });
}

export const autoPrefix = "/gassistant";
