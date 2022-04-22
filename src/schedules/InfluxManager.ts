import { Schedule } from "#root/classes/Schedule";
import { getSecret } from "#root/utils/parsers/envUtils";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";

export class InfluxManager extends Schedule {
  private readonly influx = new InfluxDB({
    url: getSecret("INFLUX_URL"),
    token: getSecret("INFLUX_TOKEN"),
  });

  private readonly writeApi = this.influx.getWriteApi(
    getSecret("INFLUX_ORG"),
    getSecret("INFLUX_BUCKET")
  );

  override async execute() {
    try {
      const point = new Point("stats")
        .intField("users", container.client.stats.users)
        .intField("guilds", container.client.stats.guilds)
        .floatField("cpuUsage", container.client.stats.cpuUsage)
        .intField("wsPing", container.client.stats.wsPing)
        .intField(
          "unavailableGuilds",
          container.client.stats.unavailableGuilds
        );

      const commandPoint = new Point("commands");
      const commandStats = await container.client.stats.getCommandStats();

      commandStats.forEach((stat) => {
        commandPoint.intField(stat.name, stat.uses);
      });

      this.writeApi.writePoint(commandPoint);
      this.writeApi.writePoint(point);
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
