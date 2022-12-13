import { Environment } from "@evie/env";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { container } from "tsyringe";
import { z } from "zod";
import { Authentication } from "../../handlers/authenticate";
import { ServiceManager } from "../../handlers/ServiceManager";
import { isAdmin } from "../middleware/isAdmin";
import { publicProcedure, router } from "../trpc";

const publicUrl = Environment.getString("PUBLIC_URL", true) || "http://localhost:9990";

export const serviceRouter = router({
	register: publicProcedure
		.use(isAdmin)
		.input(z.object({ name: z.string() }))
		.output(z.object({ id: z.string(), token: z.string() }))
		.mutation(async ({ input: { name } }) => {
			const service = await container.resolve(PrismaClient).service.create({
				data: {
					name,
					jwtSalt: crypto.randomBytes(24).toString("hex"),
				},
			});

			const token = await container.resolve(Authentication).generateToken(service.id, service.jwtSalt);

			return { id: service.id, token };
		}),
	createWebhook: publicProcedure
		.use(isAdmin)
		.input(z.object({ serviceId: z.string() }))
		.output(z.object({ url: z.string() }))
		.mutation(async ({ input: { serviceId } }) => {
			const service = await container.resolve(PrismaClient).service.findFirst({
				where: {
					id: serviceId,
				},
			});

			if (!service) {
				throw new Error("Service not found");
			}

			const webhook = await container.resolve(PrismaClient).webhook.create({
				data: {
					jwtSalt: crypto.randomBytes(24).toString("hex"),
					receiverId: service.id,
					receiver: {
						connect: {
							id: service.id,
						},
					},
				},
			});

			const token = await container.resolve(Authentication).generateToken(webhook.id, webhook.jwtSalt);

			return { url: `${publicUrl}/webhooks/${token}` };
		}),
	useWebhook: publicProcedure
		.input(z.object({ token: z.string() }))
		.output(z.object({ id: z.string() }))
		.query(async ({ input: { token }, ctx }) => {
			const webhook = await container.resolve(Authentication).authenticateWebhook(token);

			if (!webhook) {
				throw new Error("Invalid token");
			}

			await container.resolve(ServiceManager).send(webhook.receiverId, ctx.req.body);

			return { id: webhook.id };
		}),
});
