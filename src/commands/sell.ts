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
    .setName("sell")
    .setDescription("Sell an item you have for $EVIE")
    .addIntegerOption((option) =>
      option
        .setName("itemid")
        .setDescription("The item id of the thing you want to sell")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await embed(interaction.guild);

    const thing: Number = interaction.options.getInteger("itemid");
    let result = await cs.removeUserItem({
      user: interaction.user,
      item: thing,
    });
    if (result.error) {
      if (result.type === "Invalid-Item-Number")
        return interaction.editReply(
          "Please provide valid item number check your `/inventory`"
        );
      if (result.type === "Unknown-Item")
        return interaction.editReply(
          "item does not exist.... check your `/inventory`"
        );
    } else {
      let sItems = await cs.getShopItems({});
      let itemPrice = await sItems.inventory.find(
        (x) => x.name === result.inventory.name
      ).price;
      let sellPrice = itemPrice - itemPrice * 0.35;

      await cs.addMoney({
        user: interaction.user,
        amount: sellPrice,
        wheretoPutMoney: "wallet",
      });

      exampleEmbed.setDescription(
        `**Successfully sold  \`${result.inventory.name}\` for ${sellPrice} $EVIE**`
      );

      exampleEmbed.setThumbnail(
        `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
      );

      // Send Embed

      await interaction.reply({ embeds: [exampleEmbed] });
    }
  },
};
