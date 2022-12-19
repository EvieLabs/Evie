import { z } from "zod";
import { PubSubClientEvents } from "..";
import { DiscoveredSchema } from "./DiscoveredSchema";
import { TagQueryResultSchema, TagQuerySchema } from "./Tags";
import { TailWebhookSchema } from "./TailWebhook";

export const EventSchemaMap = {
	[PubSubClientEvents.TailWebhook]: TailWebhookSchema,
	[PubSubClientEvents.Discovered]: DiscoveredSchema,
	[PubSubClientEvents.Discovery]: z.null(),
	[PubSubClientEvents.TagQuery]: TagQuerySchema,
	[PubSubClientEvents.TagQueryResult]: TagQueryResultSchema,
};
