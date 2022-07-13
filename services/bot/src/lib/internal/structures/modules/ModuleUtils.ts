/* eslint-disable @typescript-eslint/no-extraneous-class */
import { container } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { Guild, MessageEmbed } from "discord.js";

export class ModuleUtils {
	public static async log(opts: { embed: MessageEmbed; guild: Guild }, modLog = false) {
		opts.embed.setTimestamp();
		opts.embed.setFooter({
			text: this.name ? `${this.name}` : "Evie Internal",
		});

		try {
			modLog
				? await container.client.guildLogger.sendEmbedToModChannel(opts.guild, opts.embed)
				: await container.client.guildLogger.sendEmbedToLogChannel(opts.guild, opts.embed);
			return;
		} catch (e) {
			return void captureException(e);
		}
	}
}
