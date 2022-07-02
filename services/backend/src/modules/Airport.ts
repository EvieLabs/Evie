import { EvieEmbed } from "#root/classes/EvieEmbed";
import placeholderParser from "#root/utils/parsers/placeholderParser";
import { time } from "@discordjs/builders";
import { EventHook, Module } from "@evie/internal";
import type { AirportSettings } from "@prisma/client";
import { Events } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { GuildMember, Role, TextChannel } from "discord.js";

export class Airport extends Module {
  public constructor(context: Module.Context, options: Module.Options) {
    super(context, {
      ...options,
      name: "Airport",
    });
  }

  @EventHook(Events.GuildMemberAdd)
  public async onGuildMemberAdd(member: GuildMember) {
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

        member.roles.add(
          role,
          await resolveKey(member.guild, "modules/airport:autoRoleReason")
        );
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }

  @EventHook(Events.GuildMemberRemove)
  public async onGuildMemberRemove(member: GuildMember) {
    console.log("Member left", member.user.tag);
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
      if (goodbyeChannel.guildId !== config.guildId) return;

      const goodbyeMessageEmbed = new EvieEmbed();
      goodbyeMessageEmbed.setDescription(goodbyeMessage.toString());

      goodbyeMessageEmbed.addField(
        await resolveKey(member.guild, "modules/airport:leftServer", {
          name: member.displayName,
        }),
        `<t:${Math.trunc(Date.now() / 1000)}:R>`
      );
      goodbyeMessageEmbed.addField(
        await resolveKey(member.guild, "modules/airport:joinedOriginally", {
          name: member.displayName,
        }),
        `${
          member.joinedAt
            ? time(member.joinedAt, "R")
            : await resolveKey(member.guild, "modules/airport:unknownTime")
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

      if (discordWelcomeChannel.guildId !== config.guildId) return;

      const welcomeMessageEmbed = new EvieEmbed();

      welcomeMessageEmbed.setDescription(welcomeMessage.toString());
      welcomeMessageEmbed.addField(
        await resolveKey(member.guild, "modules/airport:joinServer", {
          name: member.displayName,
        }),
        `${
          member.joinedAt
            ? time(member.joinedAt, "R")
            : await resolveKey(member.guild, "modules/airport:unknownTime")
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
