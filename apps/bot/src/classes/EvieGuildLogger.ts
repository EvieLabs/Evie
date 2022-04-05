import * as Sentry from "@sentry/node";
import { MessageEmbed, TextChannel, type Guild } from "discord.js";

export class EvieGuildLogger {
  public async log(guild: Guild, embed: MessageEmbed) {
    await guild.client.prisma.evieGuild
      .findFirst({
        where: {
          id: guild.id,
        },
      })
      .then(async (g) => {
        if (!g) return;
        if (!g.logChannelID) return;

        const channel = await guild.client.channels.fetch(g.logChannelID);
        if (!channel) return;
        if (!(channel instanceof TextChannel)) return;

        try {
          channel.send({ embeds: [embed] });
        } catch (e) {
          Sentry.captureException(e);
          console.error(e);
        }
      });
  }
}
