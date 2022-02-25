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
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your inventory"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await embed(interaction.guild);

    exampleEmbed.setDescription("Your Inventory is Empty!");

    let result = await cs.getUserItems({
      user: interaction.user,
    });

    let inv = result.inventory;

    let c = "`";

    for (let key in inv) {
      exampleEmbed.addField(
        `**ItemID** ${c}${parseInt(key) + 1}${c} - **${inv[key].name}:**`,
        `Amount: ${inv[key].amount}`
      );
      exampleEmbed.setDescription(`${interaction.user.username}'s Inventory!`);
    }

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
