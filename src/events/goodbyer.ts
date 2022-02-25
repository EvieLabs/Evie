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
