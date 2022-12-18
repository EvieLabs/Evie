import { container } from "tsyringe";
import { z } from "zod";
import { ServiceManager } from "../managers/ServiceManager";
import { publicProcedure, router } from "../trpc";
import { webhooksRouter } from "./webhooks";

export const appRouter = router({
	webhooks: webhooksRouter,
	health: publicProcedure
		.output(
			z.object({
				services: z.array(
					z.object({
						name: z.string(),
						ping: z.number(),
					}),
				),
			}),
		)
		.query(() => {
			const services: { name: string; ping: number }[] = [];

			for (const [uuid, service] of container.resolve(ServiceManager).services) {
				services.push({
					name: uuid,
					ping: service.ping,
				});
			}

			return {
				services,
			};
		}),
});

export type AppRouter = typeof appRouter;
