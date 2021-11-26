import { MessageEmbed, Role } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    if (await evie.getWelcomeModuleSwitch(member.guild)) {
      try {
        const welcomeChannel = await evie.getWelcomeChannel(member.guild);
        let welcomeMessage = await evie.getWelcomeMessage(member.guild);

        welcomeMessage = await evie.parse(welcomeMessage, member);

        const discordWelcomeChannel =
          member.client.channels.cache.get(welcomeChannel);
        const welcomeMessageEmbed = await evie.embed(member.guild);
        welcomeMessageEmbed.setDescription(welcomeMessage.toString());
        welcomeMessageEmbed.setAuthor(
          `Evie for ${member.guild.name}`,
          member.guild.iconURL()
        );
        welcomeMessageEmbed.addField(
          `${member.displayName} joined the server`,
          `<t:${Math.trunc(member.joinedAt.getTime() / 1000)}:R>`
        );
        discordWelcomeChannel.send({ embeds: [welcomeMessageEmbed] });
      } catch (error) {
        axo.err(error);
      }
    }
    if (await evie.isJoinRoleOn(member.guild)) {
      try {
        member.roles.add(
          await evie.getJoinRole(member.guild),
          `Auto Join Role`
        );
      } catch (error) {
        axo.err("Failed to apply auto role!");
      }
    }
  },
};
