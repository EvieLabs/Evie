import { z } from "zod";

export const TailWebhookSchema = z.object({
	metadata: z.record(z.string(), z.string()).optional(),
	tag: z.string(),
	payload: z.unknown(),
});
