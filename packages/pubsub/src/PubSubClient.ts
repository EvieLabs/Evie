import { Environment } from "@teamevie/env";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";
import { createClient, RedisClientType } from "redis";
import type { z } from "zod";
import { EventSchemaMap } from "./schemas/types";
import { deserialize, serialize } from "./schemas/_parser";

type PubSubClientEETypes = {
	[PubSubClientEvents.TailWebhook]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.TailWebhook]>];
	[PubSubClientEvents.Discovery]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.Discovery]>];
	[PubSubClientEvents.Discovered]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.Discovered]>];
	[PubSubClientEvents.TagQuery]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.TagQuery]>];
	[PubSubClientEvents.TagQueryResult]: [data: z.infer<typeof EventSchemaMap[PubSubClientEvents.TagQueryResult]>];
};

export enum PubSubClientEvents {
	TailWebhook = "tail:webhook",
	Discovery = "discovery",
	Discovered = "discovered",
	TagQuery = "tag:query",
	TagQueryResult = "tag:query:result",
}

export type PubSubClientEventTypes = {
	[T in PubSubClientEvents]: PubSubClientEETypes[T][0];
};

export interface PubSubClientOptions {
	intents?: PubSubClientEvents[];
	tail?: boolean;
}

export class PubSubClient extends AsyncEventEmitter<PubSubClientEETypes> {
	public pubClient: RedisClientType;
	public subClient: RedisClientType;
	private intents: PubSubClientEvents[];

	public constructor(
		opts: PubSubClientOptions = {
			tail: false,
		},
	) {
		super();

		this.intents = opts.intents ?? [];

		if (!opts.tail) {
			this.intents.push(PubSubClientEvents.Discovery);
		}

		this.pubClient = createClient({
			url: Environment.getString("REDIS_URL", true) ?? "redis://127.0.0.1:6379",
		});

		this.subClient = this.pubClient.duplicate();

		this.setup();
	}

	private async setup() {
		await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

		this.applyHooks();
	}

	private applyHooks() {
		const events = Object.values(PubSubClientEvents).filter((event) => this.intents.includes(event));

		for (const event of events) {
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

	public async waitFor<T extends keyof PubSubClientEETypes>(
		channel: T,
		filter: (data: PubSubClientEETypes[T][0]) => boolean,
	) {
		if (!this.intents.includes(channel)) {
			throw new Error(`Cannot wait for event ${channel} as it is not in the intents.`);
		}

		return new Promise<PubSubClientEETypes[T][0]>((resolve, reject) => {
			const listener = (data: PubSubClientEETypes[T][0]) => {
				if (filter(data)) {
					this.off(channel, listener);
					resolve(data);
				}
			};

			this.on(channel, listener);

			setTimeout(() => {
				this.off(channel, listener);
				reject(new Error(`Timed out waiting for event ${channel}`));
			}, 10000);
		});
	}
}
