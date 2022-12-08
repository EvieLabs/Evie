import { Schedule } from "#root/lib/internal/structures/schedules/Schedule";
import { container } from "@sapphire/framework";

export class ShardStatsManager extends Schedule {
	override async execute() {
		if (!container.client.shard) return;

		await container.client.prisma.shardStats.upsert({
			create: {
				id: container.client.shard.ids[0] as number,
				users: container.client.stats.users,
				guilds: container.client.stats.guilds,
				wsPing: container.client.stats.wsPing,
				unavailableGuilds: container.client.stats.unavailableGuilds,
			},
			where: {
				id: container.client.shard.ids[0] as number,
			},
			update: {
				users: container.client.stats.users,
				guilds: container.client.stats.guilds,
				wsPing: container.client.stats.wsPing,
				unavailableGuilds: container.client.stats.unavailableGuilds,
			},
		});
	}
}
