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
import { CommandInteraction } from "discord.js";
import { embed } from "../tools";

const googleIt = require("google-it");
const { MessageEmbed } = require("discord.js");

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
    const exampleEmbed = await embed(interaction.guild!);
    exampleEmbed.setTitle("Google Search Results");

    googleIt({ query: interaction.options.getString("query") })
      .then((results) => {
        results.forEach(function (item, index) {
          exampleEmbed.addField(
            index + 1 + ": " + item.title,
            "<" + item.link + ">"
          );
        });

        interaction.editReply({ embeds: [exampleEmbed] });
      })
      .catch((e) => {
        // any possible errors that might have occurred (like no Internet connection)
      });
  },
};
