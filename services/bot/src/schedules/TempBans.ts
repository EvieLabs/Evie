import { ModActionType } from "#root/Enums";
import { Schedule } from "#root/lib/internal/structures/schedules/Schedule";
import { StatusEmbed } from "@evie/internal";
import { container } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { Constants, DiscordAPIError } from "discord.js";

export class TempBans extends Schedule {
	// @ts-expect-error Not all code paths return a value.
	override async execute() {
		const { client } = container;
		const tempbans = await client.prisma.modAction.findMany({
			where: {
				type: "Ban",
				expiresAt: {
					lt: new Date(),
				},
			},
		});

		for (const tempban of tempbans) {
			if (!tempban.guildId) return;
			try {
				const guild = await client.guilds.fetch(tempban.guildId);
				const user = (await guild.bans.fetch(tempban.id)).user;

				await guild.members
					.unban(user)
					.catch(() =>
						client.guildLogger.sendEmbedToLogChannel(guild, new StatusEmbed(false, `Failed to unban ${user.tag}`)),
					);

				return void client.punishments.createModAction(guild, {
					action: "Tempban Expired",
					type: ModActionType.Unban,
					target: user,
					reason: `Temp-ban expired`,
				});
			} catch (error) {
				if (!(error instanceof DiscordAPIError)) return void captureException(error);
				if (error.code !== Constants.APIErrors.UNKNOWN_BAN) {
					return void captureException(error);
				}
			}
		}
	}
}
