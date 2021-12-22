import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View the things you can buy with $EVIE"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic
    let exampleEmbed = await embed(interaction.guild);

    let result = await cs.getShopItems({});
    let inv = result.inventory;
    let c = "`";

    for (let key in inv) {
      exampleEmbed.addField(
        `**ItemID** ${c}${parseInt(key) + 1}${c} - **${inv[key].name}:**`,
        `Price: ${inv[key].price}`
      );
    }

    exampleEmbed.setTitle(`Shop Items`);
    exampleEmbed.setDescription("Use `/buy <itemid>` to buy items!");

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
