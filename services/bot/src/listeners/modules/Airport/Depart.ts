import placeholderParser from "#root/utils/parsers/placeholderParser";
import { time } from "@discordjs/builders";
import { EvieEmbed } from "@evie/internal";
import type { AirportSettings } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { GuildMember, TextChannel } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.GuildMemberRemove,
})
export class AirportDepart extends Listener {
	public async run(member: GuildMember) {
		const settings = await member.client.db.FetchGuildSettings(member.guild);
		if (settings.airportSettings?.departs) {
			void this.departMember(member, settings.airportSettings);
		}
	}

	private async departMember(member: GuildMember, config: AirportSettings) {
		try {
			if (!config.channel) return;

			const goodbyeMessage = config.departMessage ? await placeholderParser(config.departMessage, member) : "";

			const goodbyeChannel = await member.client.channels.fetch(config.channel);

			if (!goodbyeChannel || !(goodbyeChannel instanceof TextChannel)) return;
			if (goodbyeChannel.guildId !== config.guildId) return;

			const goodbyeMessageEmbed = new EvieEmbed();
			goodbyeMessageEmbed.setDescription(goodbyeMessage.toString());

			goodbyeMessageEmbed.addField(
				await resolveKey(member.guild, "modules/airport:leftServer", {
					name: member.displayName,
				}),
				`<t:${Math.trunc(Date.now() / 1000)}:R>`,
			);
			goodbyeMessageEmbed.addField(
				await resolveKey(member.guild, "modules/airport:joinedOriginally", {
					name: member.displayName,
				}),
				`${
					member.joinedAt ? time(member.joinedAt, "R") : await resolveKey(member.guild, "modules/airport:unknownTime")
				}`,
			);

			void goodbyeChannel.send({ embeds: [goodbyeMessageEmbed] });
		} catch (error) {
			Sentry.captureException(error);
		}
	}
}
