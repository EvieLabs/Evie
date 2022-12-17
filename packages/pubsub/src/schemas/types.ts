import { z } from "zod";
import { PubSubClientEvents } from "..";
import { DiscoveredSchema } from "./DiscoveredSchema";
import { TailWebhookSchema } from "./TailWebhook";

export const EventSchemaMap = {
	[PubSubClientEvents.TailWebhook]: TailWebhookSchema,
	[PubSubClientEvents.Discovered]: DiscoveredSchema,
	[PubSubClientEvents.Discovery]: z.null(),
};
