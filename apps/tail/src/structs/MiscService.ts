import { IService, Service } from "./Service";
import { ServiceType } from "./ServiceType";

export interface IMiscService extends IService {
	name: string;
}

export class MiscService extends Service {
	/**
	 * The name of the service.
	 */
	public name: string;

	public type: ServiceType.Misc;

	public uuid: string;

	public ping: number;

	public constructor(data: IMiscService, ping: number) {
		super();
		this.type = ServiceType.Misc;
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
