import { SlashCommandBuilder } from "@discordjs/builders";
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

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

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

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed], components: [vote] });
  },
};
