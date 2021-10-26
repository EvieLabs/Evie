import { SlashCommandBuilder } from "@discordjs/builders";
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

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();
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

      exampleEmbed.setThumbnail(
        `https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`
      );
    } catch (error) {
      console.log(error);
    }

    // Fetched!

    interaction.editReply("Fetched <:applesparkle:841615919428141066>");

    // Send Embed

    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
