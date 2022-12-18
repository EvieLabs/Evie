import { PubSubClient, PubSubClientEvents, PubSubClientEventTypes } from "@evie/pubsub";
import { container } from "tsyringe";
import { BotService } from "../structs/BotService";
import { MiscService } from "../structs/MiscService";
import type { Service } from "../structs/ServiceType";

export class ServiceManager {
	public services = new Map<string, Service>();

	public constructor() {
		this.discover();

		setInterval(() => this.discover(), 5_000);
	}

	public getMetrics(): string[] {
		return [
			"# HELP tail_services_total The total amount of services.",
			"# TYPE tail_services_total gauge",
			`tail_services_total ${this.services.size}`,
			...[...this.services.values()].flatMap((service) => service.getMetrics()),
		];
	}

	public async discover() {
		const now = Date.now();
		container.resolve(PubSubClient).publish(PubSubClientEvents.Discovery, null);

		const services = await new Promise<Map<string, Service>>((resolve) => {
			const services = new Map<string, Service>();

			const listener = (data: PubSubClientEventTypes[PubSubClientEvents.Discovered]) => {
				const service = this.constructService(data, Date.now() - now);

				services.set(service.uuid, service);
			};

			container.resolve(PubSubClient).on(PubSubClientEvents.Discovered, listener);

			setTimeout(() => {
				container.resolve(PubSubClient).off(PubSubClientEvents.Discovered, listener);

				resolve(services);
			}, 5_000);
		});

		for (const [uuid] of this.services) {
			if (!services.has(uuid)) {
				this.services.delete(uuid);
			}
		}

		for (const [uuid, service] of services) {
			this.services.set(uuid, service);
		}
	}

	private constructService(data: PubSubClientEventTypes[PubSubClientEvents.Discovered], ping: number) {
		let service: Service = new MiscService(data, ping);

		switch (data.type) {
			case "bot": {
				service = new BotService(data, ping);
				break;
			}
		}

		return service;
	}
}
