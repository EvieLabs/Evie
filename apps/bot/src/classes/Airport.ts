/* 
Copyright 2022 Team Evie

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

import { axo } from "#root/axologs";
import { dbUtils } from "#root/utils/database/index";
import placeholderParser from "#root/utils/parsers/placeholderParser";
import type { EvieGuild } from "@prisma/client";
import { GuildMember, TextChannel } from "discord.js";
import { EvieEmbed } from "./EvieEmbed";

export class Airport {
  public async onJoin(member: GuildMember) {
    const config = await dbUtils.getGuild(member.guild);
    if (config?.welcomeMessageEnabled) {
      this.welcomeMember(member, config);
    }
  }

  public async onLeave(member: GuildMember) {
    const config = await dbUtils.getGuild(member.guild);
    if (config?.welcomeMessageEnabled) {
      this.farewellMember(member, config);
    }
  }

  private async farewellMember(member: GuildMember, config: EvieGuild) {
    try {
      if (!config.goodbyeChannel) return;

      const goodbyeMessage = config.goodbyeMessage
        ? await placeholderParser(config.goodbyeMessage, member)
        : "";

      const goodbyeChannel = await member.client.channels.fetch(
        config.goodbyeChannel
      );

      if (!goodbyeChannel || !(goodbyeChannel instanceof TextChannel)) return;

      const goodbyeMessageEmbed = await EvieEmbed(member.guild);
      goodbyeMessageEmbed.setDescription(goodbyeMessage.toString());

      goodbyeMessageEmbed.addField(
        `${member.displayName} left the server`,
        `<t:${Math.trunc(Date.now() / 1000)}:R>`
      );
      goodbyeMessageEmbed.addField(
        `${member.displayName} joined the server originally`,
        `${
          member.joinedAt
            ? `<t:${Math.trunc(member.joinedAt.getTime() / 1000)}:R>`
            : "At an unknown time"
        }`
      );

      goodbyeChannel.send({ embeds: [goodbyeMessageEmbed] });
    } catch (error) {
      axo.err(error);
    }
  }

  private async welcomeMember(member: GuildMember, config: EvieGuild) {
    try {
      if (!config.welcomeChannel) return;

      const welcomeMessage = config.welcomeMessage
        ? await placeholderParser(config.welcomeMessage, member)
        : "";

      const discordWelcomeChannel = await member.client.channels.fetch(
        config.welcomeChannel
      );

      if (
        !discordWelcomeChannel ||
        !(discordWelcomeChannel instanceof TextChannel)
      )
        return;

      const welcomeMessageEmbed = await EvieEmbed(member.guild);

      welcomeMessageEmbed.setDescription(welcomeMessage.toString());
      welcomeMessageEmbed.addField(
        `${member.displayName} joined the server`,
        `${
          member.joinedAt
            ? `<t:${Math.trunc(member.joinedAt.getTime() / 1000)}:R>`
            : "At an unknown time"
        }`
      );
      if (config.welcomeMessagePingEnabled) {
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
}
