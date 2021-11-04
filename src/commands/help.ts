import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Need help with me?"),
  async execute(interaction) {
    const exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();
    try {
      exampleEmbed.setDescription(
        `Hey do you need help with my commands? If so you can find a list by doing this, if you need even more help you can read more info [here](https://discord.gg/PYdASSE2gr) and also talk to our staff!`
      );
      exampleEmbed.setImage(
        `https://cdn.discordapp.com/attachments/885135206435151872/903570072675692555/RqivnDqPvH.gif`
      );
      interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },
};
