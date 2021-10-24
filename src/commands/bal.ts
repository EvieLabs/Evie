import { SlashCommandBuilder } from "@discordjs/builders";
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
    // Axolotl Fetching Mechanic

    await interaction.reply("<a:loading:877782934696919040> Fetching Query");

    let target = interaction.user;

    if (interaction.options.getUser("user")) {
      target = interaction.options.getUser("user");
    }

    let result = await cs.balance({
      user: target,
    });

    let exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

    exampleEmbed.setTitle(`${target.username}'s Balance`);
    exampleEmbed.addField(
      `**Wallet:**`,
      `<:eviecoin:900886713096888371> ${result.wallet}`,
      true
    );
    exampleEmbed.addField(
      `**Bank:**`,
      `<:eviecoin:900886713096888371> ${result.bank}`,
      true
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
