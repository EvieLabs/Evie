import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get your daily $EVIE"),
  async execute(interaction, client) {
    // Axolotl Fetching Mechanic

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

    let result = await cs.daily({
      user: interaction.user,
      amount: 15000,
    });

    if (result.error)
      exampleEmbed.setTitle(
        `Woof! ${interaction.user.username} You have already used your daily for today! You can do it again in ${result.time}`
      );
    else
      exampleEmbed.setTitle(
        `Woof! ${interaction.user.username} You just earned your daily $EVIE which was <:eviecoin:900886713096888371> 15,000.`
      );
    exampleEmbed.setThumbnail(
      `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
    );

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
