import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
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
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const exampleEmbed = await embed(interaction.guild!);
    exampleEmbed.setTitle("Google Search Results");

    googleIt({ query: interaction.options.getString("query") })
      .then((results) => {
        results.forEach(function (item, index) {
          exampleEmbed.addField(
            index + 1 + ": " + item.title,
            "<" + item.link + ">"
          );
        });

        interaction.reply({ embeds: [exampleEmbed] });
      })
      .catch((e) => {
        // any possible errors that might have occurred (like no Internet connection)
      });
  },
};
