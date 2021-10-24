export {};
const { SlashCommandBuilder } = require("@discordjs/builders");
const ee = require("../botconfig/embed.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song on the lofi radio!"),
  async execute(interaction) {
    const client = interaction.client;

    if (interaction.user.toString() == "<@97470053615673344>") {
      const newQueue = client.distube.getQueue(`819106797028769844`);

      await newQueue.skip();

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
  },
};
