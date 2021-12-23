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
