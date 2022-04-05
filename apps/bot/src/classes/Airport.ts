import { axo } from "#root/axologs";
import { dbUtils } from "#root/utils/database/index";
import placeholderParser from "#root/utils/parsers/placeholderParser";
import type { EvieGuild } from "@prisma/client";
import * as Sentry from "@sentry/node";
import { GuildMember, Role, TextChannel } from "discord.js";
import { EvieEmbed } from "./EvieEmbed";

export class Airport {
  public async onJoin(member: GuildMember) {
    const config = await dbUtils.getGuild(member.guild);
    if (config?.welcomeMessageEnabled) {
      this.welcomeMember(member, config);
    }

    if (config?.joinRoleEnabled) {
      try {
        if (member.user.bot || !config.joinRoleID) return;

        const role = await member.guild.roles.fetch(config.joinRoleID);

        if (!role || !(role instanceof Role)) return;

        member.roles.add(role, `Auto Join Role`);
      } catch (error) {
        Sentry.captureException(error);
        axo.err("Failed to apply auto role!");
      }
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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
      axo.err(error);
    }
  }
}
