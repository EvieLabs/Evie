import { Emojis, EvieEvent } from "#root/Enums";
import { getSecret } from "#root/utils/parsers/envUtils";
import { VotePayload } from "@evie/shapers";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  HttpCodes,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";
import type { Snowflake } from "discord.js";

@ApplyOptions<RouteOptions>({ route: "/votes/dlspace" })
export class DiscordListSpace extends Route {
  public async [methods.POST](_request: ApiRequest, response: ApiResponse) {
    if (
      !_request.headers.authorization ||
      _request.headers.authorization !== getSecret("DLSPACE_VOTE_SECRET")
    )
      return void response.error(HttpCodes.Forbidden);

    const body = _request.body as {
      trigger: "upvote";
      user: {
        id: Snowflake;
      };
      timestamp: number;
    };

    const payload = new VotePayload({
      userSnowflake: body.user.id,
      test: false,
      serviceName: "discordlist.space",
      voteLink: "https://discordlist.space/bot/807543126424158238/upvote",
      emoji: Emojis.discordListSpace,
    });

    await payload.init();

    this.container.client.emit(EvieEvent.Vote, payload);

    return void response.ok();
  }
}
