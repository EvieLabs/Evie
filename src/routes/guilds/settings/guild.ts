import { flattenGuild } from "#root/utils/api/ApiTransformers";
import { authenticated } from "#root/utils/api/decorators";
import { canManage } from "#root/utils/api/transformers";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  HttpCodes,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "/guilds/settings/:guild" })
export class GuildSettings extends Route {
  @authenticated()
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
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

    // send the guild and settings, but make sure to remove importedMessages from the settings

    return response.json({
      ...flattenGuild(guild),
      settings: {
        ...settings,
        importedMessages: undefined,
      },
    });
  }
}
