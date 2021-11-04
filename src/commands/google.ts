import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

const googleIt = require("google-it");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Fixes any problem!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The search query")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply("<a:loading:877782934696919040> Fetching Info");
    const exampleEmbed = new MessageEmbed()
      .setTitle("Google Search Results")
      .setColor("#0099ff")
      .setTimestamp();

    googleIt({ query: interaction.options.getString("query") })
      .then((results) => {
        results.forEach(function (item, index) {
          exampleEmbed.addField(
            index + 1 + ": " + item.title,
            "<" + item.link + ">"
          );
        });
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");

        interaction.editReply({ embeds: [exampleEmbed] });
      })
      .catch((e) => {
        // any possible errors that might have occurred (like no Internet connection)
      });
  },
};
