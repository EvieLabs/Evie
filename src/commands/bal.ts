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
