import { adminGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "update",
  description: "Update and restart evie and all her micro services",
  preconditions: ["OwnerOnly"],
  aliases: ["restart"],
})
export class Update extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!process.env.KENNEL_URL) return interaction.reply("blame doppler");
    await interaction.reply(
      "Sending a request to [kennel](https://github.com/TeamEvie/kennel/blob/main/main.go), to replace me with the latest commit."
    );
    try {
      return void (await fetch(process.env.KENNEL_URL, FetchResultTypes.Text));
    } catch (e) {
      throw `Something went wrong [here](https://github.com/TeamEvie/kennel/blob/main/main.go)`;
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: adminGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
