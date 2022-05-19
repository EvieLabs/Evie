import FunComponent from "#root/components/fun/FunComponent";
import { registeredGuilds } from "#utils/parsers/envUtils";
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
  description: "Fun Commands",
})
export class Fun extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    interaction.client.reacord.reply(
      interaction,
      <FunComponent user={interaction.user} />
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
