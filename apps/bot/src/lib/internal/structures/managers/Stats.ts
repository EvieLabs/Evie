import type { CommandStats } from "@prisma/client";
import { container } from "@sapphire/framework";
import { execSync } from "node:child_process";
export class Stats {
	public get users(): number {
		return container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
	}

	public static commitSha = container.client.coolify?.commit ?? execSync("git rev-parse HEAD").toString().trim();

	public static currentBranch =
		container.client.coolify?.branch ?? execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

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
