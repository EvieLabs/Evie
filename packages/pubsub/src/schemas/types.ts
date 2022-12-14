import { PubSubClientEvents } from "..";
import { TailWebhookSchema } from "./TailWebhook";

export const EventSchemaMap = {
	[PubSubClientEvents.TailWebhook]: TailWebhookSchema,
};
