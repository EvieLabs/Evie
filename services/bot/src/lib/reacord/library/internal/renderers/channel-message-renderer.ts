import { Renderer } from "./renderer";
import type { Channel } from "../channel";
import type { Message, MessageOptions } from "../message";

export class ChannelMessageRenderer extends Renderer {
	constructor(private readonly channel: Channel) {
		super();
	}

	protected createMessage(options: MessageOptions): Promise<Message> {
		return this.channel.send(options);
	}
}
