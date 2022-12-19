import { PubSubClientEvents, PubSubClientEventTypes } from "@evie/pubsub";
import { ApplyOptions } from "@sapphire/decorators";
import { container, Listener } from "@sapphire/framework";
import type EventEmitter from "events";

@ApplyOptions<Listener.Options>({
	once: false,
	event: PubSubClientEvents.TagQuery,
	emitter: container.client.pubsub as unknown as EventEmitter,
})
export class DiscoveryHandler extends Listener {
	public async run(query: PubSubClientEventTypes[PubSubClientEvents.TagQuery]) {
		const tag = await container.client.prisma.evieTag.findFirst({
			where: {
				slug: query.slug,
			},
		});

		if (!tag) {
			return void container.client.pubsub.emit(PubSubClientEvents.TagQueryResult, {
				nonce: query.nonce,
				tag: null,
			});
		}

		if (!tag.guildId) {
			// Tag missing guild ID
			return;
		}

		const guild = container.client.guilds.cache.get(tag.guildId);

		if (!guild) {
			// This shard doesn't have the guild
			return;
		}

		return void container.client.pubsub.publish(PubSubClientEvents.TagQueryResult, {
			nonce: query.nonce,
			tag: {
				id: tag.id,
				name: tag.name,
				content: tag.content,
				online: tag.online,
				link: tag.link,
				guild: {
					id: guild.id,
					name: guild.name,
				},
			},
		});
	}
}
