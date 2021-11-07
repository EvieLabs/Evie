import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announces a message to the announcement channel")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What should I send?")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.user.toString() == "<@97470053615673344>") {
      const announceChannel =
        interaction.client.channels.cache.get("902455135609970698");
      try {
        announceChannel.send(`${interaction.options.getString("message")}`);
      } catch (error) {
        console.log(error);
      }
      await interaction.reply({ content: "Sent!", ephemeral: true });
    } else {
      await interaction.reply({
        content: "Hey your not one of my devs! Good try tho ;)",
        ephemeral: true,
      });
    }
  },
};
