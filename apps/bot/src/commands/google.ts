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

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { EvieEmbed } from "../utils/classes/EvieEmbed";
const googleIt = require("google-it");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Fixes any problem!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The search query")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const exampleEmbed = await EvieEmbed(interaction.guild!);
    exampleEmbed.setTitle("Google Search Results");

    googleIt({ query: interaction.options.getString("query") })
      .then((results: any[]) => {
        results.forEach(function (
          item: { title: string; link: string },
          index: number
        ) {
          exampleEmbed.addField(
            index + 1 + ": " + item.title,
            "<" + item.link + ">"
          );
        });

        interaction.editReply({ embeds: [exampleEmbed] });
      })
      .catch((e: any) => {});
  },
};
