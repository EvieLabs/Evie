import placeholderParser from "#root/utils/parsers/placeholderParser";
import type { AirportSettings } from "@prisma/client";
import * as Sentry from "@sentry/node";
import { GuildMember, Role, TextChannel } from "discord.js";
import { EvieEmbed } from "./EvieEmbed";

export class Airport {
  public async onJoin(member: GuildMember) {
    const settings = await member.client.db.FetchGuildSettings(member.guild);
    if (settings?.airportSettings?.arriveMessage) {
      this.welcomeMember(member, settings.airportSettings);
    }

    if (settings?.airportSettings?.giveJoinRole) {
      try {
        if (member.user.bot || !settings.airportSettings.joinRole) return;

        const role = await member.guild.roles.fetch(
          settings.airportSettings.joinRole
        );

        if (!role || !(role instanceof Role)) return;

        member.roles.add(role, `Auto Join Role`);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }

  public async onLeave(member: GuildMember) {
    const settings = await member.client.db.FetchGuildSettings(member.guild);
    if (settings?.airportSettings?.departs) {
      this.departMember(member, settings.airportSettings);
    }
  }

  private async departMember(member: GuildMember, config: AirportSettings) {
    try {
      if (!config.channel) return;

      const goodbyeMessage = config.departMessage
        ? await placeholderParser(config.departMessage, member)
        : "";

      const goodbyeChannel = await member.client.channels.fetch(config.channel);

      if (!goodbyeChannel || !(goodbyeChannel instanceof TextChannel)) return;

      const goodbyeMessageEmbed = new EvieEmbed(member.guild);
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
    }
  }

  private async welcomeMember(member: GuildMember, config: AirportSettings) {
    try {
      if (!config.channel) return;

      const welcomeMessage = config.arriveMessage
        ? await placeholderParser(config.arriveMessage, member)
        : "";

      const discordWelcomeChannel = await member.client.channels.fetch(
        config.channel
      );

      if (
        !discordWelcomeChannel ||
        !(discordWelcomeChannel instanceof TextChannel)
      )
        return;

      const welcomeMessageEmbed = new EvieEmbed(member.guild);

      welcomeMessageEmbed.setDescription(welcomeMessage.toString());
      welcomeMessageEmbed.addField(
        `${member.displayName} joined the server`,
        `${
          member.joinedAt
            ? `<t:${Math.trunc(member.joinedAt.getTime() / 1000)}:R>`
            : "At an unknown time"
        }`
      );
      if (config.ping) {
        discordWelcomeChannel.send({
          content: `${member}`,
          embeds: [welcomeMessageEmbed],
        });
      } else {
        discordWelcomeChannel.send({ embeds: [welcomeMessageEmbed] });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
