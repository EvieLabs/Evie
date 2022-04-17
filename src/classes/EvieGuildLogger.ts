import * as Sentry from "@sentry/node";
import { MessageEmbed, TextChannel, type Guild } from "discord.js";

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
      console.log(e);
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
      console.log(e);
    }
  }
}
