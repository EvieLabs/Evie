import type { FastifyInstance } from "fastify";
import { getSecret } from "../utils/env";
import { postVote } from "../utils/grpcWrapper";

export default async function UserRouter(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      bot: string;
      user: string;
      type: "upvote" | "test";
      isWeekend: boolean;
      query: string;
    };
  }>(
    "/topgg",

    async (request, response) => {
      if (
        !request.headers.authorization ||
        request.headers.authorization !== getSecret("TOPGG_VOTE_SECRET")
      )
        return void response.status(403).send();

      await postVote({
        userSnowflake: request.body.user,
        test: request.body.type === "test",
        serviceName: "Top.gg",
        voteLink: "https://top.gg/bot/807543126424158238/vote",
      });

      return response.code(200).send();
    }
  );

  fastify.post<{
    Body: {
      id: string;
    };
  }>(
    "/dbl",

    async (request, response) => {
      // if (
      //   !request.headers.authorization ||
      //   request.headers.authorization !== getSecret("DBL_VOTE_SECRET")
      // )
      //   return void response.status(403).send();

      await postVote({
        userSnowflake: request.body.id,
        test: false,
        serviceName: "Discord Bot List",
        voteLink: "https://discordbotlist.com/bots/jamble/upvote",
      });

      return response.code(200).send();
    }
  );
}

export const autoPrefix = "/votes";
