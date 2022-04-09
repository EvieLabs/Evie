import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { LogEmbed } from "#root/classes/LogEmbed";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { Client } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.ClientReady,
})
export class GuildMemberAddListener extends Listener {
  public async run(client: Client) {
    setInterval(async () => {
      const tempbans = await client.prisma.evieTempBan.findMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      for (const tempban of tempbans) {
        if (!tempban.guildId) return;

        const guild = await client.guilds.fetch(tempban.guildId);
        const user = (await guild.bans.fetch(tempban.id)).user;

        if (!user) return;

        try {
          await guild.members.unban(user);
          await client.prisma.evieTempBan.delete({
            where: {
              id: tempban.id,
            },
          });

          await client.guildLogger.log(
            guild,
            new LogEmbed(`temp ban expired`)
              .setColor("#4e73df")
              .setAuthor({
                name: `${user.tag} (${user.id})`,
                iconURL: user.displayAvatarURL(),
              })
              .setDescription(`The temp ban on ${user.tag} has expired`)
              .addField(
                "Original reason",
                `${tempban.reason ?? "No reason given"}`
              )
              .addField(
                "Was banned by",
                `${
                  tempban.bannedBy
                    ? (await guild.members.fetch(tempban.bannedBy)).user ??
                      `Unkown (${tempban.bannedBy})`
                    : "Unknown"
                }`
              )
          );
        } catch (error) {
          Sentry.captureException(error); // heres the amazing bug
          client.guildLogger.log(
            guild,
            await StatusEmbed(StatusEmoji.FAIL, `Failed to unban ${user.tag}`)
          );
        }
      }
    }, 300000);
  }
}
