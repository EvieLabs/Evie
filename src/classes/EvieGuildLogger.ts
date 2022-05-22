import * as Sentry from "@sentry/node";
import { MessageEmbed, TextChannel, type Guild } from "discord.js";

export class EvieGuildLogger {
  public async sendEmbedToLogChannel(guild: Guild, embed: MessageEmbed) {
    try {
      const channelId = (await guild.client.db.FetchGuildProperty(
        guild,
        "logChannel"
      )) as string;
      if (!channelId) return null;

      const channel = await guild.client.channels.fetch(channelId);
      if (!channel) return null;
      if (!(channel instanceof TextChannel)) return null;

      return await channel.send({ embeds: [embed] });
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  public async sendEmbedToModChannel(guild: Guild, embed: MessageEmbed) {
    try {
      const guildSettings = await guild.client.db.FetchGuildSettings(guild);
      if (!guildSettings.moderationSettings?.logChannel) return null;

      const channel = await guild.client.channels.fetch(
        guildSettings.moderationSettings.logChannel
      );
      if (!channel) return null;
      if (!(channel instanceof TextChannel)) return null;

      return await channel.send({ embeds: [embed] });
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }
}
