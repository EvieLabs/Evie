import type { ServiceType } from "./ServiceType";

export interface IService {
	type: string;
}

export abstract class Service {
	/**
	 * The type of the service.
	 */
	public abstract type: ServiceType;

	/**
	 * A UUID for the service.
	 */
	public abstract uuid: string;

	/**
	 * The internal ping of the service.
	 */
	public abstract ping: number;
}
