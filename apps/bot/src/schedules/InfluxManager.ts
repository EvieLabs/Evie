import { Environment } from "#root/../../../packages/env/dist";
import { ShardManagerSchedule } from "#root/lib/internal/structures/schedules/ShardManagerSchedule";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import * as Sentry from "@sentry/node";
import type { ShardingManager } from "discord.js";

export class InfluxManager extends ShardManagerSchedule {
	private readonly influx = new InfluxDB({
		url: Environment.getString("INFLUX_URL"),
		token: Environment.getString("INFLUX_TOKEN"),
	});

	private readonly writeApi = this.influx.getWriteApi(
		Environment.getString("INFLUX_ORG"),
		Environment.getString("INFLUX_BUCKET"),
	);

	override async execute(manager: ShardingManager) {
		try {
			const point = new Point("stats")
				.intField("users", await manager.fetchMergeClientValues("stats.users"))
				.intField("guilds", await manager.fetchMergeClientValues("stats.guilds"))
				.intField("wsPing", await manager.fetchMergeClientValues("stats.wsPing"))
				.intField("unavailableGuilds", await manager.fetchMergeClientValues("stats.unavailableGuilds"));

			// const commandPoint = new Point("commands");
			// const commandStats = await container.client.stats.getCommandStats();

			// commandStats.forEach((stat) => {
			//   commandPoint.intField(stat.name, stat.uses);
			// });

			// this.writeApi.writePoint(commandPoint);
			this.writeApi.writePoint(point);
		} catch (error) {
			Sentry.captureException(error);
		}
	}
}
