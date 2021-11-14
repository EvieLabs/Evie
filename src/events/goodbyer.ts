import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(member) {
    if (await evie.getgoodbyeModuleSwitch(member.guild)) {
      try {
        const goodbyeChannel = await evie.getgoodbyeChannel(member.guild);
        let goodbyeMessage = await evie.getgoodbyeMessage(member.guild);

        goodbyeMessage = await evie.parse(goodbyeMessage, member);

        const discordgoodbyeChannel =
          member.client.channels.cache.get(goodbyeChannel);
        const goodbyeMessageEmbed = await evie.embed(member.guild);
        goodbyeMessageEmbed.setDescription(goodbyeMessage.toString());
        goodbyeMessageEmbed.setAuthor(
          `Evie for ${member.guild.name}`,
          member.guild.iconURL()
        );
        goodbyeMessageEmbed.addField(
          `${member.displayName} left the server`,
          `<t:${Math.trunc(Date.now() / 1000)}:R>`
        );
        goodbyeMessageEmbed.addField(
          `${member.displayName} joined the server originally`,
          `<t:${Math.trunc(member.joinedAt.getTime() / 1000)}:R>`
        );
        discordgoodbyeChannel.send({ embeds: [goodbyeMessageEmbed] });
      } catch (error) {
        axo.err(error);
      }
    }
  },
};
