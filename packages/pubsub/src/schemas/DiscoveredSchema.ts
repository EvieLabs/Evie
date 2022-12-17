import { z } from "zod";

export const DiscoveredSchema = z.union([
	z.object({
		name: z.string(),
		type: z.literal("bot"),
		data: z.object({
			shardId: z.number(),
			guildCount: z.number(),
		}),
	}),
	z.object({
		name: z.string(),
		type: z.literal("misc"),
	}),
]);
