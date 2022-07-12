import { container } from "@sapphire/pieces";
import type { FastifyInstance } from "fastify";

const { assistant } = container;
export default async function GoogleAssistantRouter(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      query: string;
    };
  }>("/ask", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.code(400).send("No query provided.");

    try {
      const { image, audio } = await assistant.ask(query);
      return await res.status(200).send({
        image,
        audio: audio || null,
      });
    } catch (e) {
      throw e;
    }
  });
}

export const autoPrefix = "/private/gassistant";
