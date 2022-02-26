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
    .setName("bal")
    .setDescription("Check your $EVIE Balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Optional: See someone elses $EVIE Balance")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    let target = interaction.user;

    if (interaction.options.getUser("user")) {
      target = interaction.options.getUser("user");
    }

    let result = await cs.balance({
      user: target,
    });

    let exampleEmbed = await embed(interaction.guild);

    exampleEmbed.setTitle(`${target.username}'s Balance`);
    exampleEmbed.addField(
      `**$EVIE Wallet:**`,
      `<:eviecoin:900886713096888371> ${result.wallet}`,
      true
    );
    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
