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
      "Sending a request to [kennel](https://github.com/TeamEvie/kennel/blob/main/main.go), to replace me with the latest commit."
    );
    try {
      return void (await fetch(process.env.KENNEL_URL, FetchResultTypes.Text));
    } catch (e) {
      throw `Something went wrong [here](https://github.com/TeamEvie/kennel/blob/main/main.go)`;
    }
  }
}
