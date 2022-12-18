import { z } from "zod";

export const DiscoveredSchema = z.union([
	z.object({
		name: z.string(),
		type: z.literal("bot"),
		data: z.object({
			shardId: z.number(),
			guildCount: z.number(),
			memberCount: z.number(),
			discordPing: z.number(),
		}),
	}),
	z.object({
		name: z.string(),
		type: z.literal("misc"),
	}),
]);
