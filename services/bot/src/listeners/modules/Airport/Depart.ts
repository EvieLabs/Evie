import placeholderParser from "#root/utils/parsers/placeholderParser";
import { time } from "@discordjs/builders";
import { EvieEmbed, ModuleConfigStore } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { GuildMember, TextChannel } from "discord.js";
import type { Airport } from "./types";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.GuildMemberRemove,
	name: "airportDepart",
})
export class AirportDepart extends Listener {
	public config = new ModuleConfigStore<Airport.Config>({
		moduleName: "airport",
	});

	public run(member: GuildMember) {
		const config = this.config.get(member.guild.id);

		if (config?.departs) {
			void this.departMember(member, config);
		}
	}

	private async departMember(member: GuildMember, config: ModuleConfigStore.Output<Airport.Config>) {
		try {
			if (!config.channel) return;

			const goodbyeMessage = config.departMessage ? await placeholderParser(config.departMessage, member) : "";

			const goodbyeChannel = await member.client.channels.fetch(config.channel);

			if (!goodbyeChannel || !(goodbyeChannel instanceof TextChannel)) return;

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
