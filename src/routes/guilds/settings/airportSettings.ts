import { flattenGuild } from "#root/utils/api/ApiTransformers";
import { authenticated } from "#root/utils/api/decorators";
import { canManage } from "#root/utils/api/transformers";
import type { AirportSettings } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  HttpCodes,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "/guilds/settings/:guild/airport" })
export class AirportSettingsRoute extends Route {
  @authenticated()
  public async [methods.PATCH](request: ApiRequest, response: ApiResponse) {
    const guildId = request.params.guild;
    const guild = await this.container.client.guilds.fetch(guildId);
    if (!guild) return response.error(HttpCodes.BadRequest);

    const member = await guild.members
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .fetch(request.auth!.id)
      .catch(() => null);
    if (!member) return response.error(HttpCodes.BadRequest);

    if (!(await canManage(guild, member)))
      return response.error(HttpCodes.Forbidden);

    const settings = await this.container.client.db.FetchGuildSettings(guild);
    if (!settings) return response.error(HttpCodes.BadRequest);

    const requestBody = request.body as Partial<AirportSettings>;

    const data = await this.container.client.db.UpdateAirPortSettings(
      guild,
      requestBody
    );

    return response.json({
      ...flattenGuild(guild),
      airportSettings: data,
    });
  }
}
