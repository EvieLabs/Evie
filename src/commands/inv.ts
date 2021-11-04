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

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTimestamp()
      .setDescription("Your Inventory is Empty!");

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

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
