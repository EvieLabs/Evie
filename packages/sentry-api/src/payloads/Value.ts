import type { Type } from "./Common";
import type { Stacktrace } from "./Stacktrace";

export interface Value {
	type: Type;
	value?: string;
	mechanism?: Mechanism;
	threadId?: null;
	module?: null;
	stacktrace?: Stacktrace;
	rawStacktrace?: null;
	timestamp?: Date;
	level?: string;
	message?: null | string;
	category?: string;
	data?: ValueData | null;
	event_id?: null;
}

export interface ValueData {
	method: string;
	status_code: number;
	url: string;
}

export interface Mechanism {
	type: string;
	handled: boolean;
}
