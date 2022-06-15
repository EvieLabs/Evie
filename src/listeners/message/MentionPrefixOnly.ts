import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.MentionPrefixOnly,
})
export class MentionPrefixOnly extends Listener {
  public async run(message: Message) {
    const help = this.container.stores
      .get("commands")
      .find((command) => command.name === "help");

    if (!help || !help.messageRun) return;

    // @ts-expect-error - This command doesn't require context or args
    help.messageRun(message);
  }
}
