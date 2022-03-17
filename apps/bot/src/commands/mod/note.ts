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

import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { modDB } from "#root/utils/database/modSettings";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class Note extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await modDB.hasModRole(interaction.member))) {
      await StatusEmbed(
        StatusEmoji.FAIL,
        "You do not have the required permissions to create notes.",
        interaction
      );
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "leave") {
      await this.leave(interaction);
      return;
    } else if (subcommand === "delete") {
      await this.delete(interaction);
      return;
    } else if (subcommand === "view") {
      await this.list(interaction);
      return;
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand({
      name: this.name,
      description: "Leave notes on people",
      options: [
        {
          type: 1,
          name: "leave",
          description: "Leave a note on a user",
          options: [
            {
              name: "user",
              description: "The user to leave a note on",
              required: true,
              type: "USER",
            },
          ],
        },
        {
          type: 1,
          name: "delete",
          description: "Delete a note on a user",
          options: [
            {
              name: "user",
              description: "The user to delete a note on",
              required: true,
              type: "USER",
            },
            {
              autocomplete: true,
              type: "STRING",
              name: "note",
              description: "The note to delete",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "view",
          description: "View a note on a user",
          options: [
            {
              name: "user",
              description: "The user to view a note on",
              required: true,
              type: "USER",
            },
            {
              autocomplete: true,
              type: "STRING",
              name: "note",
              description: "The note to view",
              required: true,
            },
          ],
        },
      ],
    });
  }
}
