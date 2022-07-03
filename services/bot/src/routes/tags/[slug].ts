import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  HttpCodes,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "/tags/:slug" })
export class TagRoute extends Route {
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
    const slug = request.params.slug;
    if (!slug) return response.error(HttpCodes.BadRequest);

    const tag = await this.container.client.prisma.evieTag.findFirst({
      where: {
        online: true,
        slug,
      },
    });

    if (!tag || !tag.guildId) return response.error(HttpCodes.BadRequest);

    const guild = await this.container.client.guilds.fetch(tag.guildId);

    if (!guild) return response.error(HttpCodes.BadRequest);

    return response.json({
      name: tag.name,
      content: tag.content,
      link: tag.link,
      guildName: guild.name,
    });
  }
}
