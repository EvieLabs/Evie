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

import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { Modal, showModal, TextInputComponent } from "discord-modals";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

export class Tag extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const tag = interaction.options.getString("query");
    if (tag == "create") {
      const modal = new Modal({
        title: "New Tag",
        custom_id: "newtag",
        components: [
          new TextInputComponent({
            custom_id: "name",
            label: "Tag Name",
            max_length: 10,
            min_length: 2,
            placeholder: "my amazing tag",
            required: true,
            style: 1,
            value: "Tag Name",
          }),
          new TextInputComponent({
            custom_id: "content",
            label: "Tag Content",
            max_length: 500,
            min_length: 2,
            placeholder: "my amazing tag content",
            required: true,
            style: 2,
            value: "my amazing tag content",
          }),
        ],
      });

      await showModal(modal, {
        client: interaction.client, // This method needs the Client to show the Modal through the Discord API.
        interaction: interaction, // This method needs the Interaction to show the Modal with the Interaction ID & Token.
      });
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
