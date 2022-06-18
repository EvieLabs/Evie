import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  container,
  RegisterBehavior,
} from "@sapphire/framework";

import HandbookComponent from "#root/components/info/HandbookComponent";
import { registeredGuilds } from "@evie/config";
import type { CommandInteraction } from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Learn how to use Evie",
  name: "handbook",
})
export class GetStarted extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const basePage = container.client.handbook.pages.get("Welcome");
    if (!basePage) throw "Handbook unavailable!";

    interaction.client.reacord.reply(
      interaction,
      <HandbookComponent user={interaction.user} basePage={basePage} />
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
      }
    );
  }
}
