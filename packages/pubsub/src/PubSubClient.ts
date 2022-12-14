import { Environment } from "@evie/env";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";
import { createClient, RedisClientType } from "redis";
import type { z } from "zod";
import { TailWebhookSchema } from "./schemas/TailWebhook";
import { EventSchemaMap } from "./schemas/types";
import { deserialize, serialize } from "./schemas/_parser";

type PubSubClientEETypes = {
	[PubSubClientEvents.TailWebhook]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.TailWebhook]>];
};

export enum PubSubClientEvents {
	TailWebhook = "tail:webhook",
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
		this.subClient.subscribe(PubSubClientEvents.TailWebhook, (message) => {
			this.emit(PubSubClientEvents.TailWebhook, deserialize(TailWebhookSchema, message));
		});
	}

	public async publish<T extends PubSubClientEvents>(channel: T, data: PubSubClientEventTypes[T]) {
		const serialized = serialize(EventSchemaMap[channel], data);
		await this.pubClient.publish(channel, serialized);
	}
}
