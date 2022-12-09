import { AirportConfigSchema } from "#root/Constants";
import placeholderParser from "#root/utils/parsers/placeholderParser";
import { time } from "@discordjs/builders";
import { EvieEmbed, ModuleConfigStore } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { InferType } from "@sapphire/shapeshift";
import * as Sentry from "@sentry/node";
import { GuildMember, Role, TextChannel } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: false,
	event: Events.GuildMemberAdd,
	name: "airportWelcome",
})
export class AirportWelcome extends Listener {
	public config = new ModuleConfigStore<InferType<typeof AirportConfigSchema>>({
		moduleName: "airport",
		schema: AirportConfigSchema,
	});

	public async run(member: GuildMember) {
		const config = this.config.get(member.guild.id);

		if (config?.arriveMessage) {
			void this.welcomeMember(member, config);
		}

		if (config?.giveJoinRole) {
			try {
				if (member.user.bot || !config.joinRole) return;

				const role = await member.guild.roles.fetch(config.joinRole);

				if (!role || !(role instanceof Role)) return;

				void member.roles.add(role, await resolveKey(member.guild, "modules/airport:autoRoleReason"));
			} catch (error) {
				Sentry.captureException(error);
			}
		}
	}

	private async welcomeMember(
		member: GuildMember,
		config: ModuleConfigStore.Nullish<InferType<typeof AirportConfigSchema>>,
	) {
		try {
			if (!config.channel) return;

			const welcomeMessage = config.arriveMessage ? await placeholderParser(config.arriveMessage, member) : "";

			const discordWelcomeChannel = await member.client.channels.fetch(config.channel);

			if (!discordWelcomeChannel || !(discordWelcomeChannel instanceof TextChannel)) return;

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
