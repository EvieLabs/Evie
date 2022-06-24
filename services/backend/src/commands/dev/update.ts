import { ApplyOptions } from "@sapphire/decorators";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "update",
  description: "Update and restart evie and all her micro services",
  preconditions: ["OwnerOnly"],
  aliases: ["restart"],
})
export class Update extends Command {
  public override async messageRun(message: Message) {
    if (!process.env.KENNEL_URL) return message.reply("blame doppler");
    await message.reply(
      "sending a request to kill me and replace me with a new pm2 process"
    );
    try {
      return void (await fetch(process.env.KENNEL_URL, FetchResultTypes.Text));
    } catch (e) {
      return void (await message.reply(
        `something happened at ${new Date().toTimeString()} (gone bad) [somewhere here](https://github.com/TeamEvie/kennel/blob/main/main.go)`
      ));
    }
  }
}
