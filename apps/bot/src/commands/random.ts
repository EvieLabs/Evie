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
import { EvieEmbed } from "../utils/classes/EvieEmbed";

import { Client, CommandInteraction } from "discord.js";
import { axo } from "../axologs";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rand")
    .setDescription("Picks a random user"),
  async execute(interaction: CommandInteraction, client: Client) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await EvieEmbed(interaction.guild);
    try {
      exampleEmbed.setTitle(`Random User`);

      await interaction.guild?.members
        .fetch()
        .then((data) =>
          exampleEmbed.setDescription(
            `The user I randomly chose was ${interaction.guild?.members.cache.random(
              1
            )}`
          )
        )
        .catch((error) => axo.err(error));
    } catch (error) {
      console.log(error);
    }

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
