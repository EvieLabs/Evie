import DogMenu from "#root/components/fun/dog/DogMenu";
import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  ChatInputCommand,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";
import React from "react";

@ApplyOptions<ChatInputCommand.Options>({
  description: "View pictures of dogs",
})
export class Dog extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    interaction.client.reacord.reply(
      interaction,
      <DogMenu user={interaction.user} />
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954566141454471258"],
      }
    );
  }
}
