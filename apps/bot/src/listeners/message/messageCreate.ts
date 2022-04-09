import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.MessageCreate,
})
export class MessageCreate extends Listener {
  public async run(message: Message) {
    if (message.author.bot || !message.inGuild()) return;

    message.client.phisherman.scan(message);
    message.client.blockedWords.scan(message);

    if (!message.guild.me) return;
  }
}
