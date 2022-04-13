import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";
import { createCanvas, loadImage } from "canvas";

@ApplyOptions<RouteOptions>({ route: "/render/stats" })
export class StatsRoute extends Route {
  public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
    const users = this.container.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const servers = this.container.client.guilds.cache.reduce(
      (acc) => acc + 1,
      0
    );
    const avatar = this.container.client.user
      ? await loadImage(
          this.container.client.user.displayAvatarURL({ format: "jpg" })
        )
      : null;

    const canvas = createCanvas(700, 250);
    const context = canvas.getContext("2d");

    context.fillStyle = "#23272A";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // in the middle right on the canvas stack the users and servers
    context.font = "28px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(`${users} users`, canvas.width / 2, canvas.height / 2);
    context.fillText(
      `${servers} servers`,
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    context.drawImage(avatar, 25, 25, 200, 200);

    canvas.createPNGStream().pipe(response);
  }
}
