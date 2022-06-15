import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  container,
  RegisterBehavior,
} from "@sapphire/framework";

import HelpComponent from "#root/components/info/HelpComponent";
import { Emojis } from "#root/Enums";
import { registeredGuilds } from "@evie/config";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { CommandInteraction, Message } from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Show command list",
  name: "help",
  aliases: ["cmds", "commands"],
})
export class Help extends Command {
  private categorizeCommands(commandStore: Command[]): {
    [key: string]: Command[];
  } {
    const categories: { [key: string]: Command[] } = {};
    for (const command of commandStore) {
      if (command.category) {
        const parsedCategory = `${command.category}${
          command.subCategory ? `/${command.subCategory}` : ""
        }`;

        if (!categories[parsedCategory]) {
          categories[parsedCategory] = [];
        }
        categories[parsedCategory].push(command);
      }
    }
    return categories;
  }

  public override async messageRun(message: Message) {
    const commands = this.categorizeCommands(
      container.stores.get("commands").map((command) => command)
    );

    const description = await resolveKey(message, "commands/help:description");
    const title = await resolveKey(message, "commands/help:title", {
      emoji: Emojis.evie,
    });

    message.client.reacord.messageReply(
      message,
      <HelpComponent
        infoEmbed={{
          title,
          description,
        }}
        user={message.author}
        commands={commands}
      />
    );
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const commands = this.categorizeCommands(
      container.stores.get("commands").map((command) => command)
    );

    const description = await resolveKey(
      interaction,
      "commands/help:description"
    );
    const title = await resolveKey(interaction, "commands/help:title", {
      emoji: Emojis.evie,
    });

    interaction.client.reacord.ephemeralReply(
      interaction,
      <HelpComponent
        infoEmbed={{
          title,
          description,
        }}
        user={interaction.user}
        commands={commands}
      />
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("about")
          .setDescription("Hey I'm Evie, Ready to get started with me?"),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
