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
    .setName("daily")
    .setDescription("Get your daily $EVIE"),
  async execute(interaction, client) {
    let exampleEmbed = await embed(interaction.guild);

    let result = await cs.daily({
      user: interaction.user,
      amount: 15000,
    });

    if (result.error)
      exampleEmbed.setTitle(
        `Woof! ${interaction.user.username} You have already used your daily for today! You can do it again in ${result.time}`
      );
    else
      exampleEmbed.setTitle(
        `Woof! ${interaction.user.username} You just earned your daily $EVIE which was <:eviecoin:900886713096888371> 15,000.`
      );
    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
