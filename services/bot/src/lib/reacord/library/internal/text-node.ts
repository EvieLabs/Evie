import type { MessageOptions } from "./message";
import { Node } from "./node.js";

export class TextNode extends Node<string> {
	override modifyMessageOptions(options: MessageOptions) {
		options.content += this.props;
	}
}
