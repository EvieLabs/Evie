import { Emojis, EvieEvent } from "#root/Enums";
import { VotePayload } from "#root/lib/shapers";
import { PubSubClientEvents, PubSubClientEventTypes } from "@evie/pubsub";
import { ApplyOptions } from "@sapphire/decorators";
import { container, Listener } from "@sapphire/framework";
import type EventEmitter from "events";
import { z } from "zod";

@ApplyOptions<Listener.Options>({
	once: false,
	event: PubSubClientEvents.TailWebhook,
	emitter: container.client.pubsub as unknown as EventEmitter,
})
export class VoteHandler extends Listener {
	public run(raw: PubSubClientEventTypes[PubSubClientEvents.TailWebhook]) {
		const data = this.schema.parse(raw);

		let payload: VotePayload;

		switch (data.tag) {
			case "vote/topgg": {
				payload = new VotePayload({
					emoji: Emojis.topgg,
					serviceName: "Top.gg",
					test: data.payload.type === "test",
					userSnowflake: data.payload.user,
					voteLink: "https://top.gg/bot/807543126424158238/vote",
				});
				break;
			}

			case "vote/discordbotlist": {
				payload = new VotePayload({
					emoji: Emojis.discordBotList,
					serviceName: "Discord Bot List",
					test: false,
					userSnowflake: data.payload.id,
					voteLink: "https://discordbotlist.com/bots/jamble/upvote",
				});
				break;
			}
		}

		container.client.emit(EvieEvent.Vote, payload);
	}

	private topgg = z.object({
		payload: z.object({
			bot: z.string(),
			user: z.string(),
			type: z.union([z.literal("upvote"), z.literal("test")]),
			isWeekend: z.boolean(),
			query: z.string().optional(),
		}),
		tag: z.literal("vote/topgg"),
	});

	private discordBotList = z.object({
		payload: z.object({
			admin: z.boolean(),
			avatar: z.string(),
			username: z.string(),
			id: z.string(),
		}),
		tag: z.literal("vote/discordbotlist"),
	});

	private schema = z.union([this.topgg, this.discordBotList]);
}
