import { modAction } from "#root/utils/builders/stringBuilder";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import { MessageEmbed, TextChannel, User, type Guild } from "discord.js";
import { LogEmbed } from "./LogEmbed";

export class EvieGuildLogger {
  public async log(guild: Guild, embed: MessageEmbed) {
    try {
      const guildSettings = await guild.client.db.FetchGuildSettings(guild);
      if (!guildSettings.logChannel) return;

      const channel = await guild.client.channels.fetch(
        guildSettings.logChannel
      );
      if (!channel) return;
      if (!(channel instanceof TextChannel)) return;

      await channel.send({ embeds: [embed] });
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  public async modLog(guild: Guild, embed: MessageEmbed) {
    try {
      const guildSettings = await guild.client.db.FetchGuildSettings(guild);
      if (!guildSettings.moderationSettings?.logChannel) return;

      const channel = await guild.client.channels.fetch(
        guildSettings.moderationSettings.logChannel
      );
      if (!channel) return;
      if (!(channel instanceof TextChannel)) return;

      await channel.send({ embeds: [embed] });
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  public modAction(
    guild: Guild,
    options: {
      action: string;
      target: User;
      moderator?: User;
      reason?: string;
    }
  ) {
    container.client.guildLogger.modLog(
      guild,
      new LogEmbed(`moderation`)
        .setColor("#eb564b")
        .setAuthor({
          name: options.moderator
            ? `${options.moderator.tag} (${options.moderator.id})`
            : `${container.client.user ? container.client.user.tag : "Me"} (${
                container.client.user ? container.client.user.id : "Me"
              })`,
        })
        .setDescription(
          modAction(options.target, options.action, options.reason)
        )
    );
  }
}
