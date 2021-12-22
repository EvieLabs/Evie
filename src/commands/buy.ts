import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy something with your $EVIE")
    .addIntegerOption((option) =>
      option
        .setName("itemid")
        .setDescription("The item id of the thing you want to buy")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let exampleEmbed = await embed(interaction.guild);

    let thing = interaction.options.getInteger("itemid");
    if (!thing)
      return interaction.reply("Please provide item number! check the `/shop`");
    if (thing == 2) {
      return interaction.reply(
        "Sorry but you can only sell a `Muffin` instead buy a `Basic Oven` and bake them using `/bake muffin`"
      );
    }
    let result = await cs.buy({
      user: interaction.user,
      item: thing,
    });
    if (result.error) {
      if (result.type === "No-Item")
        return interaction.reply(
          "Please provide valid item number check the `/shop`"
        );
      if (result.type === "Invalid-Item")
        return interaction.reply("item does not exist.... check the `/shop`");
      if (result.type === "low-money")
        return interaction.reply(
          `**You don't have enough $EVIE to buy this!**`
        );
    } else
      exampleEmbed.setDescription(
        `**Successfully bought  \`${result.inventory.name}\` for ${result.inventory.price} $EVIE**`
      );

    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );
    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
