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

@ApplyOptions<RouteOptions>({ route: "/votes/topgg" })
export class TopggVote extends Route {
  public async [methods.POST](_request: ApiRequest, response: ApiResponse) {
    if (
      !_request.headers.authorization ||
      _request.headers.authorization !== getSecret("TOPGG_VOTE_SECRET")
    )
      return void response.error(HttpCodes.Forbidden);

    const body = _request.body as {
      bot: Snowflake;
      user: Snowflake;
      type: "upvote" | "test";
      isWeekend: boolean;
      query: string;
    };

    const payload = new VotePayload({
      userSnowflake: body.user,
      test: body.type === "test",
      serviceName: "Top.gg",
      voteLink: "https://top.gg/bot/807543126424158238/vote",
      emoji: Emojis.topgg,
    });

    await payload.init();

    this.container.client.emit(EvieEvent.Vote, payload);

    return void response.ok();
  }
}
