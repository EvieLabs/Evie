import type { ServiceType } from "./ServiceType";

export interface IService {
	name: string;
}

export abstract class Service {
	public name: string;

	public abstract type: ServiceType;

	public uuid: string;

	public ping: number;

	public constructor(data: IService, ping: number) {
		this.name = data.name;
		this.uuid = data.name;
		this.ping = ping;
	}

	public getMetrics(): string[] {
		return [
			`# HELP tail_service_ping The ping of the service.`,
			`# TYPE tail_service_ping gauge`,
			`tail_service_ping{service="${this.uuid}"} ${this.ping}`,
		];
	}
}
