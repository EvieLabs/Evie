export enum Type {
	Default = "default",
	HTTP = "http",
	TypeError = "TypeError",
}

export interface GroupingConfig {
	enhancements: string;
	id: string;
}

export interface Tag {
	key: string;
	value: string;
}

export interface SDK {
	name: string;
	version: string;
}
