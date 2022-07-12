import React from "react";
import { ReacordElement } from "../../internal/element.js";
import { EmbedChildNode } from "./embed-child.js";
import type { EmbedOptions } from "./embed-options";

/**
 * @category Embed
 */
export type EmbedAuthorProps = {
	name?: string;
	children?: string;
	url?: string;
	iconUrl?: string;
};

/**
 * @category Embed
 */
export function EmbedAuthor(props: EmbedAuthorProps) {
	return <ReacordElement props={props} createNode={() => new EmbedAuthorNode(props)} />;
}

class EmbedAuthorNode extends EmbedChildNode<EmbedAuthorProps> {
	override modifyEmbedOptions(options: EmbedOptions): void {
		options.author = {
			name: this.props.name ?? this.props.children ?? "",
			url: this.props.url,
			icon_url: this.props.iconUrl,
		};
	}
}
