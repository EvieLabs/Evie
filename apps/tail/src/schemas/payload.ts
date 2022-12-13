import { z } from "zod";

export const PayloadSchema = z.object({
	t: z.string(),
	d: z.unknown(),
});
