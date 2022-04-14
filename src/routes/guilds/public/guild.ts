import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  HttpCodes,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "guilds/public/:guild" })
export class UserRoute extends Route {
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
    const guildId = request.params.guild;
    const guild = await this.container.client.guilds.fetch(guildId);
    if (!guild) return response.error(HttpCodes.BadRequest);

    return response.json({
      guild: {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        memberCount: guild.memberCount,
      },
    });
  }
}
