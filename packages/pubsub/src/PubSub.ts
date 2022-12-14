import { PubSubClient } from "./PubSubClient";

/**
 * A singleton class that provides access to the PubSubClient.
 */
export class PubSub {
	private static _instance: PubSubClient;

	public static getClient(): PubSubClient {
		if (!PubSub._instance) {
			PubSub._instance = new PubSubClient();
		}
		return PubSub._instance;
	}
}
