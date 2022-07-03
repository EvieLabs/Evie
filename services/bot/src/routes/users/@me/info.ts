import {
  flattenGuild,
  flattenUser,
  type FlattenedGuild,
} from "#root/utils/api/ApiTransformers";
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

@ApplyOptions<RouteOptions>({
  route: "/users/@me",
})
export class UserRoute extends Route {
  @authenticated()
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
    const { client } = this.container;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await client.users.fetch(request.auth!.id).catch(() => null);
    if (user === null) return response.error(HttpCodes.InternalServerError);

    const guilds: FlattenedGuild[] = [];
    for (const guild of client.guilds.cache.values()) {
      if (guild.members.cache.has(user.id)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (await canManage(guild, guild.members.cache.get(user.id)!)) {
          guilds.push(flattenGuild(guild));
        }
      }
    }
    return response.json({
      user: flattenUser(user),
      transformedGuilds: guilds,
    });
  }
}
