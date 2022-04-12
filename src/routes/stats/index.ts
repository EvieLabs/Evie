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
  public [methods.GET](_request: ApiRequest, response: ApiResponse) {
    response.json({
      users: this.container.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0
      ),
      servers: this.container.client.guilds.cache.reduce((acc) => acc + 1, 0),
    });
  }
}
