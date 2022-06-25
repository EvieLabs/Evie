import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  container,
  RegisterBehavior,
} from "@sapphire/framework";

import HandbookComponent from "#root/components/info/HandbookComponent";
import { lang, registeredGuilds } from "@evie/config";
import type { CommandInteraction } from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Learn how to use Evie",
  name: "handbook",
})
export class GetStarted extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const ephemeral = !interaction.options.getBoolean("show") ?? false;

    const basePage = container.client.handbook.pages.get("Welcome");
    if (!basePage) throw "Handbook unavailable!";

    return ephemeral
      ? void interaction.client.reacord.ephemeralReply(
          interaction,
          <HandbookComponent user={interaction.user} basePage={basePage} />
        )
      : void interaction.client.reacord.reply(
          interaction,
          <HandbookComponent user={interaction.user} basePage={basePage} />
        );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: lang.SHOW_COMMAND_OPTION_NAME,
            description: lang.SHOW_COMMAND_OPTION_DESCRIPTION,
            type: "BOOLEAN",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
