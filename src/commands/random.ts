import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rand")
    .setDescription("Picks a random user"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await embed(interaction.guild);
    try {
      exampleEmbed.setTitle(`Random User`);

      await interaction.guild.members
        .fetch()
        .then((data) =>
          exampleEmbed.setDescription(
            `The user I randomly chose was ${interaction.guild.members.cache.random(
              1
            )}`
          )
        )
        .catch((error) => axo.err(error));
    } catch (error) {
      console.log(error);
    }

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
