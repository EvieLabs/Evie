import { z } from "zod";

export const AuthSchema = z.object({
	t: z.literal("auth"),
	d: z.object({
		token: z.string(),
	}),
});
