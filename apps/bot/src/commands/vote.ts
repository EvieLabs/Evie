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

import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";
import { EvieCommand } from "../types";

const command: EvieCommand = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Help us grow!"),
  async execute(interaction) {
    let exampleEmbed = await embed(interaction.guild);

    exampleEmbed.setTitle(`Want to help us grow?`);
    exampleEmbed.setDescription(
      `By voting for us on top.gg, you'll help us grow!`
    );

    const vote = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Top.gg")
        .setStyle("LINK")
        .setURL("https://top.gg/bot/807543126424158238/vote")
    );

    await interaction.reply({
      embeds: [exampleEmbed],
      components: [vote],
      ephemeral: true,
    });
  },
};

export default command;
