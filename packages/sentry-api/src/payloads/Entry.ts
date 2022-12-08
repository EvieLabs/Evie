import type { Value } from "./Value";

export interface Entry {
	data: EntryData;
	type: string;
}

export interface EntryData {
	values: Value[];
	hasSystemFrames?: boolean;
	excOmitted?: null;
}
