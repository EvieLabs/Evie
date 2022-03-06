/* 
Copyright 2022 Tristan Camejo

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

import { ActionRow } from "@discordjs/builders";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  SapphireClient,
} from "@sapphire/framework";
import { TextInputStyle } from "discord-api-types/v9";
import { CommandInteraction } from "discord.js";

import { Modal, showModal, TextInputComponent } from "discord-modals";
declare module "discord-modals" {
  export function showModal(
    modal: Modal,
    options: {
      client: SapphireClient;
      interaction: CommandInteraction;
    }
  ): Promise<any>;
}

export class ModalTest extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const modal = new Modal({
      title: "Test Modal",
      custom_id: "testmodal",
      components: [
        new TextInputComponent({
          custom_id: "testinput",
          label: "Test Input",
          max_length: 10,
          min_length: 5,
          placeholder: "Test Placeholder",
          required: true,
          style: 1,
          value: "Test Value",
        }),
      ],
    });

    await showModal(modal, {
      client: interaction.client, // This method needs the Client to show the Modal through the Discord API.
      interaction: interaction, // This method needs the Interaction to show the Modal with the Interaction ID & Token.
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "sends a modal",
      },
      {
        guildIds: ["901426442242498650"],
      }
    );
  }
}
