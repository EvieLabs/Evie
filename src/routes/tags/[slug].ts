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
export class StatsRoute extends Route {
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
    const slug = request.params.slug;
    if (!slug) return response.error(HttpCodes.BadRequest);

    const tag = await this.container.client.prisma.evieTag.findFirst({
      where: {
        online: true,
        slug,
      },
    });

    if (!tag) return response.error(HttpCodes.BadRequest);

    return response.json({
      name: tag.name,
      content: tag.content,
      link: tag.link,
    });
  }
}
