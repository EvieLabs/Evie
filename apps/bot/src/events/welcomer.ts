/* 
Copyright 2022 Tristan Camejo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { GuildMember, MessageEmbed, Role, TextChannel } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member: GuildMember) {
    if (await evie.getWelcomeModuleSwitch(member.guild)) {
      try {
        const welcomeChannel = await evie.getWelcomeChannel(member.guild);
        let welcomeMessage = await evie.getWelcomeMessage(member.guild);

        welcomeMessage = await evie.parse(welcomeMessage, member);

        const discordWelcomeChannel: TextChannel =
          member.client.channels.cache.get(welcomeChannel)! as TextChannel;
        const welcomeMessageEmbed = await evie.embed(member.guild);
        welcomeMessageEmbed.setDescription(welcomeMessage.toString());
        welcomeMessageEmbed.setAuthor(
          `Evie for ${member.guild.name}`,
          member.guild.iconURL()!
        );
        welcomeMessageEmbed.addField(
          `${member.displayName} joined the server`,
          `<t:${Math.trunc(member.joinedAt!.getTime() / 1000)}:R>`
        );
        if (await evie.getWelcomePingSwitch(member.guild)) {
          discordWelcomeChannel.send({
            content: `${member}`,
            embeds: [welcomeMessageEmbed],
          });
        } else {
          discordWelcomeChannel.send({ embeds: [welcomeMessageEmbed] });
        }
      } catch (error) {
        axo.err(error);
      }
    }
    if (await evie.isJoinRoleOn(member.guild)) {
      try {
        if (member.user.bot) return;
        member.roles.add(
          (await evie.getJoinRole(member.guild)) as string,
          `Auto Join Role`
        );
      } catch (error) {
        axo.err("Failed to apply auto role!");
      }
    }
  },
};
