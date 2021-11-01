import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("View my Privacy Policy"),
  async execute(interaction) {
    await interaction.reply({
      content: "You can read it over here https://privacy.eviebot.rocks/",
      ephemeral: true,
    });
  },
};
