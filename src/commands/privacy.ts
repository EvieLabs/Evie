import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

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
