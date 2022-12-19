import { z } from "zod";
import { GuildSchema } from "./Guild";

export const TagSchema = z.object({
	id: z.string(),
	name: z.string(),
	content: z.string(),
	online: z.boolean(),
	link: z.string().nullable(),
	guild: GuildSchema,
});

export const TagQueryResultSchema = z.object({
	nonce: z.string(),
	tag: TagSchema.nullable(),
});

export const TagQuerySchema = z.object({
	nonce: z.string(),
	slug: z.string(),
});
