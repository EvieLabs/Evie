import { container } from "tsyringe";
import { z } from "zod";
import { ServiceManager } from "../managers/ServiceManager";
import { ServiceSchema } from "../schemas/serviceSchema";
import { ServiceType } from "../structs/ServiceType";
import { publicProcedure, router } from "../trpc";
import { webhooksRouter } from "./webhooks";

export const appRouter = router({
	webhooks: webhooksRouter,
	health: publicProcedure
		.output(
			z.object({
				services: z.array(ServiceSchema),
			}),
		)
		.query(() => {
			const services: z.infer<typeof ServiceSchema>[] = [];

			for (const [_, service] of container.resolve(ServiceManager).services) {
				switch (service.type) {
					case ServiceType.Bot: {
						services.push({
							type: service.type,
							name: service.name,
							internalPing: service.ping,
							discordPing: service.memberCount,
							guilds: service.guildCount,
							members: service.memberCount,
							shard: service.shardId,
						});
						break;
					}
					case ServiceType.Misc: {
						services.push({
							type: service.type,
							name: service.name,
							internalPing: service.ping,
						});
						break;
					}
				}
			}

			return {
				services,
			};
		}),
});

export type AppRouter = typeof appRouter;
