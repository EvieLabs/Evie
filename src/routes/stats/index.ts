import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";
import { cpus } from "os";
import * as pidusage from "pidusage";

@ApplyOptions<RouteOptions>({ route: "/stats" })
export class StatsRoute extends Route {
  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    const stats = await pidusage.default(process.pid);

    response.json({
      users: this.container.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
      guilds: this.container.client.guilds.cache.reduce((acc) => acc + 1, 0),
      cpuUsage: parseFloat((stats.cpu / cpus().length).toFixed(2)),
      wsPing: this.container.client.ws.ping,
      unavailableGuilds: this.container.client.guilds.cache.filter(
        (guild) => !guild.available
      ).size,
    });
  }
}
