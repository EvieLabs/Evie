import type { CommandStats } from "@prisma/client";
import { container } from "@sapphire/framework";
export class Stats {
	public get users(): number {
		return container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
	}

	public async getCommandStats(): Promise<CommandStats[]> {
		return container.client.prisma.commandStats.findMany();
	}

	public get guilds(): number {
		return container.client.guilds.cache.reduce((acc) => acc + 1, 0);
	}

	public get wsPing(): number {
		return container.client.ws.ping;
	}

	public get unavailableGuilds(): number {
		return container.client.guilds.cache.filter((guild) => !guild.available).size;
	}

	public shardStats() {
		return {
			users: this.users,
			guilds: this.guilds,
			wsPing: this.wsPing,
			unavailableGuilds: this.unavailableGuilds,
		};
	}
}
