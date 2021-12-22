import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
import { MessageActionRow, MessageButton } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for me and get some free $EVIE!"),
  async execute(interaction) {
    // Axolotl Fetching Mechanic

    let exampleEmbed = await embed(interaction.guild);

    exampleEmbed.setTitle(`Want some free $EVIE?`);
    exampleEmbed.setDescription(
      `By [voting](https://top.gg/bot/807543126424158238/vote) for me over at [top.gg](https://top.gg/bot/807543126424158238/vote) you can get a free <:eviecoin:900886713096888371> 45,000 $EVIE`
    );
    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );

    // Buttons

    const vote = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Vote :D")
        .setStyle("LINK")
        .setURL("https://top.gg/bot/807543126424158238/vote")
    );

    await interaction.reply({ embeds: [exampleEmbed], components: [vote] });
  },
};
