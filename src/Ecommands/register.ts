import { SlashCommandBuilder } from "@discordjs/builders";
const regiSlash = require("../events/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reslash")
    .setDescription("Add all new slash commands"),
  async execute(interaction) {
    const client = interaction.client;

    if (interaction.user.toString() == "<@97470053615673344>") {
      regiSlash;
      await interaction.reply({
        content: "Refreshing!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Hey! Your not one of my Devs!",
        ephemeral: true,
      });
    }
  },
};
