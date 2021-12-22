import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Who has the most $EVIE?"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic
    let exampleEmbed = await embed(interaction.guild);

    let data = await cs.leaderboard();
    let pos = 0;
    // This is to get First 10 Users )

    data.slice(0, 10).map((e) => {
      pos++;
      if (!interaction.client.users.cache.get(e.userID)) return;
      exampleEmbed.addField(
        `${pos} - **${interaction.client.users.cache.get(e.userID).username}**`,
        `**$EVIE Wallet:** <:eviecoin:900886713096888371> ${e.wallet}`,
        false
      );
    });

    exampleEmbed.setTitle(`$EVIE Global Leaderboard`);
    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );
    exampleEmbed.setDescription(
      `this list only shows users that are [cached](https://eviebot.rocks/cache)`
    );

    // Send Embed

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
