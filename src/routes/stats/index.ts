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
    const stats = await pidusage.default(process.pid, { usePs: true });

    response.json({
      users: this.container.client.stats.users,
      guilds: this.container.client.stats.guilds,
      cpuUsage: parseFloat((stats.cpu / cpus().length).toFixed(2)),
      wsPing: this.container.client.stats.wsPing,
    });
  }
}
