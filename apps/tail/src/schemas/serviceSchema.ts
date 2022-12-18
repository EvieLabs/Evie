import { z } from "zod";

export const ServiceSchema = z.union([
	z.object({
		type: z.literal("bot"),
		name: z.string(),
		internalPing: z.number(),
		discordPing: z.number(),
		guilds: z.number(),
		members: z.number(),
		shard: z.number(),
	}),
	z.object({
		type: z.literal("misc"),
		name: z.string(),
		internalPing: z.number(),
	}),
]);
