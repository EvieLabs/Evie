import { ShardStatsManager } from "#root/schedules/ShardStatsManager";
import { TempBans } from "#root/schedules/TempBans";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.ClientReady,
})
export class ClientReadyListener extends Listener {
	public async run() {
		this.container.logger.info(
			[
				` > Logged in as ${this.container.client.user?.tag}! (${this.container.client.user?.id})`,
				` * Serving ${this.container.client.guilds.cache.size} guilds.`,
				` * Serving ${this.container.client.users.cache.size} users.`,
				` ? Shard ${this.container.client.shard?.ids[0] ?? 0} of ${this.container.client.shard?.count ?? 1}`,
			].join("\n"),
		);

		new TempBans("*/10 * * * *");
		new ShardStatsManager("*/15 * * * * *");

		for (const guild of this.container.client.guilds.cache.values()) {
			this.container.logger.debug(` * Upserting guild ${guild.id} (${guild.name})`);
			await this.container.client.db.FetchGuildSettings(guild);
			this.container.logger.debug(` > Upserted guild ${guild.id} (${guild.name})`);
		}
	}
}
