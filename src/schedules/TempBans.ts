import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { LogEmbed } from "#root/classes/LogEmbed";
import { Schedule } from "#root/classes/Schedule";
import * as Sentry from "@sentry/node";
import { Client, Constants } from "discord.js";

export class TempBans extends Schedule {
  override async execute(client: Client) {
    const tempbans = await client.prisma.evieTempBan.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    for (const tempban of tempbans) {
      if (!tempban.guildId) return;
      try {
        const guild = await client.guilds.fetch(tempban.guildId);
        const user = (
          await guild.bans.fetch(tempban.id).catch(async (err) => {
            if (err.code == Constants.APIErrors.UNKNOWN_BAN) {
              await client.prisma.evieTempBan.delete({
                where: {
                  id: tempban.id,
                },
              });
            }
          })
        )?.user;

        if (!user) return;

        await guild.members
          .unban(user)
          .catch(() =>
            client.guildLogger.log(
              guild,
              StatusEmbed(StatusEmoji.FAIL, `Failed to unban ${user.tag}`)
            )
          );
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
        Sentry.captureException(error);
      }
    }
  }
}
