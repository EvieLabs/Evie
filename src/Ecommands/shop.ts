import { SlashCommandBuilder } from "@discordjs/builders";
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

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

    let result = await cs.getShopItems({});
    let inv = result.inventory;

    for (let key in inv) {
      exampleEmbed.addField(
        `${parseInt(key) + 1} - **${inv[key].name}:**`,
        `Price: ${inv[key].price}`
      );
    }

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
