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
    if (!process.env.KENNEL_URL || !process.env.KENNEL_TOKEN)
      return message.reply("Kennel URL or Token not set!");
    await message.reply("Sending a request to update and restart me!");
    try {
      return void (await fetch(
        process.env.KENNEL_URL,
        {
          headers: {
            Authorization: process.env.KENNEL_TOKEN,
          },
        },
        FetchResultTypes.Text
      ));
    } catch (e) {
      message.reply("Error! Check dms");
      return void message.author.send(JSON.stringify(e, null, 2));
    }
  }
}
