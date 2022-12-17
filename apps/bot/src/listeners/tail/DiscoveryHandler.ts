import { PubSubClientEvents } from "@evie/pubsub";
import { ApplyOptions } from "@sapphire/decorators";
import { container, Listener } from "@sapphire/framework";
import type EventEmitter from "events";

@ApplyOptions<Listener.Options>({
	once: false,
	event: PubSubClientEvents.Discovery,
	emitter: container.client.pubsub as unknown as EventEmitter,
})
export class DiscoveryHandler extends Listener {
	public async run() {
		container.client.pubsub.publish(PubSubClientEvents.Discovered, {
			type: "bot",
			name: "Evie",
			data: {
				shardId: container.client.shard?.ids[0] ?? 0,
				guildCount: container.client.guilds.cache.size,
			},
		});
	}
}
