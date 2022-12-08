import type { EmbedOptions } from "./embed-options";
import { Node } from "../../internal/node.js";

export abstract class EmbedChildNode<Props> extends Node<Props> {
	abstract modifyEmbedOptions(options: EmbedOptions): void;
}
