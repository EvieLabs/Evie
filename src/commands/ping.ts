import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction) {
    await interaction.reply({
      content: `Pong! That took me ${interaction.client.ws.ping.toString()}ms`,
      ephemeral: true,
    });
  },
};
