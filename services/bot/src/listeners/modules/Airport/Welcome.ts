import placeholderParser from "#root/utils/parsers/placeholderParser";
import { time } from "@discordjs/builders";
import { EvieEmbed } from "@evie/internal";
import type { AirportSettings } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { GuildMember, Role, TextChannel } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.GuildMemberAdd,
})
export class AirportWelcome extends Listener {
	public async run(member: GuildMember) {
		const settings = await member.client.db.FetchGuildSettings(member.guild);
		if (settings.airportSettings?.arriveMessage) {
			void this.welcomeMember(member, settings.airportSettings);
		}

		if (settings.airportSettings?.giveJoinRole) {
			try {
				if (member.user.bot || !settings.airportSettings.joinRole) return;

				const role = await member.guild.roles.fetch(settings.airportSettings.joinRole);

				if (!role || !(role instanceof Role)) return;

				void member.roles.add(role, await resolveKey(member.guild, "modules/airport:autoRoleReason"));
			} catch (error) {
				Sentry.captureException(error);
			}
		}
	}

	private async welcomeMember(member: GuildMember, config: AirportSettings) {
		try {
			if (!config.channel) return;

			const welcomeMessage = config.arriveMessage ? await placeholderParser(config.arriveMessage, member) : "";

			const discordWelcomeChannel = await member.client.channels.fetch(config.channel);

			if (!discordWelcomeChannel || !(discordWelcomeChannel instanceof TextChannel)) return;

			if (discordWelcomeChannel.guildId !== config.guildId) return;

			const welcomeMessageEmbed = new EvieEmbed();

			welcomeMessageEmbed.setDescription(welcomeMessage.toString());
			welcomeMessageEmbed.addField(
				await resolveKey(member.guild, "modules/airport:joinServer", {
					name: member.displayName,
				}),
				`${
					member.joinedAt ? time(member.joinedAt, "R") : await resolveKey(member.guild, "modules/airport:unknownTime")
				}`,
			);
			if (config.ping) {
				void discordWelcomeChannel.send({
					content: `${member.toString()}`,
					embeds: [welcomeMessageEmbed],
				});
			} else {
				void discordWelcomeChannel.send({ embeds: [welcomeMessageEmbed] });
			}
		} catch (error) {
			Sentry.captureException(error);
		}
	}
}
