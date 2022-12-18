import { z } from "zod";

export const ServiceSchema = z.union([
	z.object({
		name: z.string(),
		internalPing: z.number(),
		discordPing: z.number(),
		guilds: z.number(),
		members: z.number(),
	}),
	z.object({
		name: z.string(),
		internalPing: z.number(),
	}),
]);
