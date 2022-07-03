import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "/stats" })
export class StatsRoute extends Route {
  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    response.json({
      users: this.container.client.stats.users,
      guilds: this.container.client.stats.guilds,
      wsPing: this.container.client.stats.wsPing,
    });
  }
}
