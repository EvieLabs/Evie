import * as Sentry from "@sentry/node";
import { MessageEmbed, TextChannel, type Guild } from "discord.js";

export class EvieGuildLogger {
	public async sendEmbedToLogChannel(guild: Guild, embed: MessageEmbed) {
		try {
			const channelId = (await guild.client.db.FetchGuildProperty(guild, "logChannel")) as string;
			if (!channelId) return null;

			const channel = await guild.client.channels.fetch(channelId);
			if (!channel) return null;
			if (!(channel instanceof TextChannel)) return null;
			if (channel.guildId !== guild.id) return null;

			return await channel.send({ embeds: [embed] });
		} catch (e) {
			Sentry.captureException(e);
			return null;
		}
	}

	public async getModChannel(guild: Guild) {
		try {
			const guildSettings = await guild.client.db.FetchGuildSettings(guild);
			if (!guildSettings.moderationSettings?.logChannel) throw new Error("No channel set.");

			const channel = await guild.client.channels.fetch(guildSettings.moderationSettings.logChannel);
			if (!channel) throw new Error("Channel not found.");
			if (!(channel instanceof TextChannel)) throw new Error("Channel is not a text channel.");
			if (channel.guildId !== guild.id) throw new Error("Channel is not in the requested guild.");

			return channel;
		} catch (e) {
			throw e;
		}
	}

	public async sendEmbedToModChannel(guild: Guild, embed: MessageEmbed) {
		try {
			const channel = await this.getModChannel(guild);

			return await channel.send({ embeds: [embed] });
		} catch (e) {
			Sentry.captureException(e);
			return null;
		}
	}
}
