import type { GETEventPayload, GETLatestEventPayload } from "./payloads";

export class SentryClient {
	private readonly apiRoot = "https://sentry.io/api/0";

	private token: string;
	private organizationSlug: string;

	public constructor({ organizationSlug, token }: { organizationSlug: string; token: string }) {
		this.organizationSlug = organizationSlug;
		this.token = token;
	}

	private async _request<T>(method: string, path: string, body?: unknown): Promise<T> {
		const res = await fetch(`${this.apiRoot}${path}`, {
			method,
			headers: {
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (res.status >= 400) {
			throw new Error(`${method} ${path} returned ${res.status} ${res.statusText}`);
		}

		return res.json();
	}

	public async resolveEventId(eventId: string): Promise<GETEventPayload> {
		return this._request<GETEventPayload>("GET", `/organizations/${this.organizationSlug}/eventids/${eventId}/`);
	}

	public async resolveLatestEvent(issueId: string): Promise<GETLatestEventPayload> {
		return this._request<GETLatestEventPayload>("GET", `/issues/${issueId}/events/latest/`);
	}
}
