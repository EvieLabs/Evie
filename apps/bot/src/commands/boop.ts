/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ApplicationCommandRegistry, Args, Command } from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
} from "discord.js";

export class Boop extends Command {
  public override async messageRun(message: Message, args: Args) {
    if (message.author.id !== "97470053615673344") return;
    const user = await args.pick("user");

    await message.reply({
      content: `${user} just got booped by ${message.author}`,
      allowedMentions: { users: [...new Set([message.author.id, user.id])] },
    });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const user = interaction.options.getUser("user_to_boop", true);

    await interaction.reply({
      content: `${user} boop`,
      allowedMentions: { users: [...new Set([interaction.user.id, user.id])] },
    });
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (interaction.user.id !== "139836912335716352") {
      await interaction.reply({
        ephemeral: true,
        content: "This maze wasn't meant for you.",
      });
      return;
    }

    const user =
      interaction.targetType === "USER"
        ? interaction.options.getUser("user", true).id
        : interaction.options.getMessage("message", true).author.id;

    await interaction.reply({
      content: `<@${user}> just got booped by ${interaction.user}`,
      allowedMentions: { users: [...new Set([interaction.user.id, user])] },
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Boops the specified user",
        options: [
          {
            name: "user_to_boop",
            description: "Who shall be booped today? >:3",
            type: "USER",
          },
        ],
      },
      {
        guildIds: process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : [],
      }
    );

    registry.registerContextMenuCommand(
      {
        name: "Boop user",
        type: "USER",
      },
      {
        guildIds: process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : [],
      }
    );

    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Boop message author gently")
          .setType(ApplicationCommandType.Message),
      {
        guildIds: process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : [],
      }
    );
  }
}
