import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { container } from "tsyringe";
import { z } from "zod";
import { isAdmin } from "../middleware/isAdmin";
import { publicProcedure, router } from "../trpc";
import { Env } from "../utils/Env";
import { generateToken } from "../utils/utils";

export const MetaDataSchema = z.record(z.string(), z.string()).optional();

const WebhookOutputSchema = z.object({
	id: z.string(),
	url: z.string(),
	metadata: MetaDataSchema,
	tag: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const webhooksRouter = router({
	create: publicProcedure
		.use(isAdmin)
		.input(z.object({ metadata: z.record(z.string(), z.string()).optional(), tag: z.string() }))
		.output(WebhookOutputSchema)
		.mutation(async ({ input: { metadata, tag } }) => {
			const webhook = await container.resolve(PrismaClient).webhook.create({
				data: {
					jwtSalt: crypto.randomBytes(16).toString("hex"),
					metadata,
					tag,
				},
			});

			const token = await generateToken(webhook.id);

			return {
				url: `${container.resolve(Env).publicUrl}/webhooks/${token}`,
				createdAt: webhook.createdAt.toISOString(),
				id: webhook.id,
				metadata: webhook.metadata as Record<string, string>,
				updatedAt: webhook.updatedAt.toISOString(),
				tag: webhook.tag,
			};
		}),
});
