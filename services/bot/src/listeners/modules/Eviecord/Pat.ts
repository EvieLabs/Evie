import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

const PAT_USER_ID = "193988283645034496";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.MessageCreate,
})
export class Pat extends Listener {
	public run(message: Message) {
		if (message.author.id !== PAT_USER_ID || message.guild?.id !== this.container.client.kennel.guildId) return;
		if (!(message.content.toLowerCase().includes("good morning") || message.content.toLowerCase().includes("gm")))
			return;

		void message.reply("morning pat");
	}
}
