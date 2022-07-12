/* eslint-disable @typescript-eslint/no-misused-promises */
import { Emojis, EvieEvent } from "#root/Enums";
import { IVoteManagerServer, PostVoteRequest, PostVoteResponse } from "@evie/grpc";
import type { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import type { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { EvieSharder } from "../../extensions/EvieSharder";

export const VoteManagerServer: IVoteManagerServer = {
	postVote: async (
		call: ServerUnaryCall<PostVoteRequest, Empty>,
		callback: sendUnaryData<PostVoteResponse>,
	): Promise<void> => {
		const res = new PostVoteResponse();

		res.setOk(false);

		try {
			const { userSnowflake, test, serviceName, voteLink } = call.request.toObject();

			function switchEmoji() {
				switch (serviceName) {
					case "Top.gg":
						return Emojis.topgg;
					case "Discord Bot List":
						return Emojis.discordBotList;
					default:
						return "";
				}
			}

			const emoji = switchEmoji();

			const mutualShard = EvieSharder.getInstance().shards.get(0);
			if (!mutualShard) throw new Error("No mutual shard found");

			await mutualShard.eval(
				async (c, { userSnowflake, test, serviceName, voteLink, emoji, vote }) => {
					const payload = new c.votePayload({
						userSnowflake: userSnowflake,
						test: test,
						serviceName: serviceName,
						voteLink: voteLink,
						emoji: emoji,
					});

					await payload.init();

					c.emit(vote, payload);
				},
				{
					userSnowflake,
					test,
					serviceName,
					voteLink,
					emoji,
					vote: EvieEvent.Vote,
				},
			);

			res.setOk(true);

			return void callback(null, res);
		} catch (error) {
			console.error(error);
			return void callback(null, res);
		}
	},
};
