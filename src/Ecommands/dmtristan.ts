import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { getLang } from "../index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dmtristan")
    .setDescription("Adds a line of text to my memory core")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What should I send to him?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const langdb = getLang();
    const guildID = interaction.guild.id.toString();
    console.log(langdb);
    await interaction.reply({ content: "Sent!", ephemeral: true });

    const msg = interaction.options.getString("message");
    // append string to your file
    await interaction.guild.members
      .fetch()
      .then((data) =>
        interaction.client.users.cache
          .get("97470053615673344")
          .send(interaction.user.tag.toString() + " said: " + msg)
      )
      .catch((error: any) => console.log(error));
  },
};
