import { Emojis, EvieEvent } from "#root/Enums";
import { getSecret } from "@evie/config";
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

@ApplyOptions<RouteOptions>({ route: "/votes/dbl" })
export class DiscordBotListVote extends Route {
  public async [methods.POST](_request: ApiRequest, response: ApiResponse) {
    if (
      !_request.headers.authorization ||
      _request.headers.authorization !== getSecret("DBL_VOTE_SECRET")
    )
      return void response.error(HttpCodes.Forbidden);

    const body = _request.body as {
      id: Snowflake;
    };

    const payload = new VotePayload({
      userSnowflake: body.id,
      test: false,
      serviceName: "Discord Bot List",
      voteLink: "https://discordbotlist.com/bots/jamble/upvote",
      emoji: Emojis.discordBotList,
    });

    await payload.init();

    this.container.client.emit(EvieEvent.Vote, payload);

    return void response.ok();
  }
}
