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
    .setName("beg")
    .setDescription("Beg for some $EVIE"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await embed(interaction.guild);

    let result = await cs.beg({
      user: interaction.user,
      minAmount: 100,
      maxAmount: 400,
    });
    if (result.error) {
      const c = "`";
      const begMsg = [
        `Woof! stop begging! but do it again in ${result.time}`,
        `Woof! You homeless or something? But do it again in ${result.time}`,
        `Woof! Get a job and do something more productive, but you can beg again in ${result.time}`,
        `Woof! Could you be more lazy, seriously begging is for losers! Wait ${result.time}`,
      ];
      const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
      exampleEmbed.setDescription(begMsg[index]);
    } else {
      const c = "`";
      const begMsg = [
        `omg tristan just ran ${c}/give ${interaction.user.username} $EVIE ${result.amount}${c}`,
        `Discord had no other options but to donate ${result.amount} $EVIE to you!`,
        `<:eviecoin:900886713096888371> ${result.amount} go brrrrrrrr`,
      ];
      const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
      exampleEmbed.setDescription(begMsg[index]);
    }

    exampleEmbed.setFooter(`Imagine begging lol`);

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
