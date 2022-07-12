import { Renderer } from "./renderer";
import type { Interaction } from "../interaction";
import type { Message, MessageOptions } from "../message";

// keep track of interaction ids which have replies,
// so we know whether to call reply() or followUp()
const repliedInteractionIds = new Set<string>();

export class InteractionReplyRenderer extends Renderer {
	constructor(private readonly interaction: Interaction) {
		super();
	}

	protected createMessage(options: MessageOptions): Promise<Message> {
		if (repliedInteractionIds.has(this.interaction.id)) {
			return this.interaction.followUp(options);
		}

		repliedInteractionIds.add(this.interaction.id);
		return this.interaction.reply(options);
	}
}
