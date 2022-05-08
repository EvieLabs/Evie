import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { Schedule } from "#root/classes/Schedule";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import { Constants } from "discord.js";

export class TempBans extends Schedule {
  override async execute() {
    const { client } = container;
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
              new StatusEmbed(StatusEmoji.FAIL, `Failed to unban ${user.tag}`)
            )
          );
        await client.prisma.evieTempBan.delete({
          where: {
            id: tempban.id,
          },
        });

        client.guildLogger.modAction(guild, {
          action: "Unban",
          target: user,
          reason: `Temp-ban expired`, // TODO: Track mod action messages and reference the message link
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }
}
