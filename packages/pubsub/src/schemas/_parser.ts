import type { z } from "zod";

export function serialize<T extends z.ZodSchema<any>>(schema: T, data: z.infer<T>) {
	try {
		return JSON.stringify(schema.parse(data));
	} catch (error) {
		console.error(`--- Failed to serialize data ---⤵ `);
		throw new Error(`[@evie/pubsub] Failed to serialize data!`);
	}
}

export function deserialize<T extends z.ZodSchema<any>>(schema: T, data: string) {
	try {
		return schema.parse(JSON.parse(data));
	} catch (error) {
		console.error(`--- Failed to deserialize data: \`${data}\` ---⤵ `);
		throw new Error(`[@evie/pubsub] Failed to deserialize data!`);
	}
}
