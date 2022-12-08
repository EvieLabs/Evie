import type { Type } from "./Common";
import type { ContextClass } from "./ContextClass";

export interface Meta {
	entries: ContextClass;
	message: null;
	user: null;
	contexts: null;
	sdk: null;
	context: null;
	packages: null;
	tags: ContextClass;
}

export interface Metadata {
	display_title_with_tree_label: boolean;
	filename: string;
	function: string;
	type: Type;
	value: string;
}
