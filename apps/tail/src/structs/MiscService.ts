import { IService, Service } from "./Service";
import { ServiceType } from "./ServiceType";

export interface IMiscService extends IService {
	type: string;
}

export class MiscService extends Service {
	public declare type: ServiceType.Misc;

	public constructor(data: IMiscService, ping: number) {
		super(data, ping);
		this.type = ServiceType.Misc;
	}
}
