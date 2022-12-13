import type { Request } from "express";
import { z } from "zod";
import { UserError } from "./UserError";

export async function validate<T extends z.AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
	try {
		return await schema.parseAsync(req);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new UserError(error.message);
		}

		throw error;
	}
}
