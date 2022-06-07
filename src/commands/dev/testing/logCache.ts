import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "logcache",
  description: "Log the current db cache to the console",
  preconditions: ["OwnerOnly"],
  aliases: ["lg"],
})
export class LogCache extends Command {
  public override async messageRun(message: Message) {
    this.container.logger.debug(this.container.client.dbCache);

    await message.reply("check the console owo");
  }
}
