import { Environment } from "@evie/env";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";
import { createClient, RedisClientType } from "redis";
import type { z } from "zod";
import { EventSchemaMap } from "./schemas/types";
import { deserialize, serialize } from "./schemas/_parser";

type PubSubClientEETypes = {
	[PubSubClientEvents.TailWebhook]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.TailWebhook]>];
	[PubSubClientEvents.Discovery]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.Discovery]>];
	[PubSubClientEvents.Discovered]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.Discovered]>];
};

export enum PubSubClientEvents {
	TailWebhook = "tail:webhook",
	Discovery = "discovery",
	Discovered = "discovered",
}

export type PubSubClientEventTypes = {
	[T in PubSubClientEvents]: PubSubClientEETypes[T][0];
};

export class PubSubClient extends AsyncEventEmitter<PubSubClientEETypes> {
	public pubClient: RedisClientType;
	public subClient: RedisClientType;

	public constructor() {
		super();

		this.pubClient = createClient({
			url: Environment.getString("REDIS_URL"),
		});

		this.subClient = this.pubClient.duplicate();

		this.setup();
	}

	private async setup() {
		await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

		this.applyHooks();
	}

	private applyHooks() {
		for (const event of Object.values(PubSubClientEvents)) {
			this.subClient.subscribe(event, (message) => {
				this.emit(event, deserialize(EventSchemaMap[event], message));
			});
		}
	}

	public async publish<T extends PubSubClientEvents>(channel: T, data: PubSubClientEventTypes[T]) {
		const schema = EventSchemaMap[channel];

		const serialized = serialize(schema, data);
		await this.pubClient.publish(channel, serialized);
	}
}
