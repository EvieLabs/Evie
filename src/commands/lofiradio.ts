export {};
import { SlashCommandBuilder } from "@discordjs/builders";
const ee = require("../botconfig/embed.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lofiradio")
    .setDescription("Change settings with my 24/7 lofi module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("skip")
        .setDescription("Skips the current song on the lofi radio!")
    ),
  async execute(interaction) {
    const client = interaction.client;
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "skip":
        if (interaction.user.toString() == "<@97470053615673344>") {
          await interaction.client.distube
            .getQueue(`897433283921580062`)
            .skip();

          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.color)
                .setTimestamp()
                .setTitle(`⏭ **Skipped to the next Song!**`)
                .setFooter(
                  `💢 Skipped by: ${interaction.user.username.toString()}`,
                  interaction.user.displayAvatarURL({ dynamic: true })
                ),
            ],
            ephemeral: false,
          });
        } else {
          await interaction.reply({
            content:
              "Hey! Your not Tristan! This command skips the current song playing on the 24/7 lofi radio here https://discord.gg/bCsWkXQAVn",
            ephemeral: true,
          });
        }
        break;
      // case "hi":
      //   await interaction.reply(`hi whats up`);
      //   break;
    }
  },
};
