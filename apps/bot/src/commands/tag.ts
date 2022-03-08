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

import { CreateTagModal } from "#constants/modals";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

export class Tag extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const tag = interaction.options.getString("query");
    if (tag == "create") {
      interaction.showModal(CreateTagModal);
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    await interaction.respond([
      {
        name: "� Create a new tag",
        value: "create",
      },
    ]);
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Send a tag",
        options: [
          {
            name: "query",
            description: "The name of the tag",
            type: "STRING",
            autocomplete: true,
          },
          {
            name: "target",
            description: "Targeted user",
            type: "USER",
            required: false,
          },
        ],
      },
      {
        guildIds: process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : [],
      }
    );
  }
}
