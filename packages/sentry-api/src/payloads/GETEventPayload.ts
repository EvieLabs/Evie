import type { Event } from "./Event";

export interface GETEventPayload {
	organizationSlug: string;
	projectSlug: string;
	groupId: string;
	eventId: string;
	event: Event;
}
