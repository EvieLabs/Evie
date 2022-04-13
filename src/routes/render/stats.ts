import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";
import { loadImage } from "canvas";
import nodeHtmlToImage from "node-html-to-image";
import { renderFile } from "pug";
@ApplyOptions<RouteOptions>({ route: "/render/stats.png" })
export class StatsRoute extends Route {
  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    if (!this.container.client.user)
      return response.status(500).json("User not found");

    const bot = this.container.client.user;
    const users = this.container.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const guilds = this.container.client.guilds.cache.reduce(
      (acc) => acc + 1,
      0
    );
    const avatar = this.container.client.user
      ? await loadImage(
          this.container.client.user.displayAvatarURL({ format: "jpg" })
        )
      : null;

    response.setHeader("Content-Type", "image/png");
    nodeHtmlToImage({
      html: renderFile("./templates/stats.pug", {
        botName: bot.username,
        users,
        guilds,
      }),
    }).then((img) => {
      response.end(img);
    });
  }
}
