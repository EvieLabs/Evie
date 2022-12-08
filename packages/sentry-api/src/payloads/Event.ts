import type { GroupingConfig, SDK, Tag } from "./Common";
import type { ContextClass } from "./ContextClass";
import type { Entry } from "./Entry";
import type { Meta, Metadata } from "./Meta";

export interface Event {
	id: string;
	groupID: string;
	eventID: string;
	projectID: string;
	size: number;
	entries: Entry[];
	dist: null;
	message: string;
	title: string;
	location: string;
	user: null;
	contexts: ContextClass;
	sdk: SDK;
	context: ContextClass;
	packages: ContextClass;
	type: string;
	metadata: Metadata;
	tags: Tag[];
	platform: string;
	dateReceived: Date;
	errors: Error[];
	_meta: Meta;
	crashFile: null;
	culprit: string;
	dateCreated: Date;
	fingerprints: string[];
	groupingConfig: GroupingConfig;
}
