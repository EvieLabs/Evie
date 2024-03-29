import { checkPerm } from "#root/utils/misc/permChecks";
import { lang, registeredGuilds } from "@evie/config";
import { EditReplyStatusEmbed, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import { AutocompleteInteraction, CommandInteraction, Permissions } from "discord.js";
@ApplyOptions<Command.Options>({
	description: "Un-ban a user",
	preconditions: ["ModOrBanPermsOnly"],
	requiredClientPermissions: ["BAN_MEMBERS"],
})
export class UnBan extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.inCachedGuild()) return;

		const target = interaction.options.getString("user");
		const reason = interaction.options.getString("reason");
		const show = !interaction.options.getBoolean("show") || false;

		if (!target) {
			await ReplyStatusEmbed(false, "You must specify a user to ban.", interaction);
			return;
		}

		await interaction.deferReply({ ephemeral: show });

		try {
			const user = await interaction.client.punishments.unBanGuildMember(
				target,
				interaction.guild,
				reason ?? "No reason provided.",
				interaction.member,
			);

			await EditReplyStatusEmbed(
				true,
				`Successfully unbanned ${user?.username ?? "unknown"}#${user?.discriminator ?? "unknown"}`,
				interaction,
			);
			return;
		} catch (e) {
			Sentry.captureException(e);
			void EditReplyStatusEmbed(false, "Failed to un-ban user.", interaction);
		}
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
		if (!interaction.inCachedGuild()) return;

		if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
			return interaction.respond([
				{
					name: "Hey you don't have the required permissions to un-ban users.",
					value: "notadmin",
				},
			]);
		}

		const bans =
			interaction.guild.bans.cache.size === 0 ? await interaction.guild.bans.fetch() : interaction.guild.bans.cache;

		const query = interaction.options.getString("user") ?? "";

		if (bans.size === 0) {
			return interaction.respond([
				{
					name: "No bans found. Must be nice.",
					value: "nobans",
				},
			]);
		}

		return interaction.respond(
			bans

				.map((ban) => ({
					name: `🚫${ban.user.username}#${ban.user.discriminator}`,
					value: ban.user.id,
				}))
				.filter(
					(ban) =>
						ban.name.toLowerCase().includes(query.toLowerCase()) ||
						ban.value.toLowerCase().includes(query.toLowerCase()),
				),
		);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "user",
						description: "The user to un-ban",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
					{
						name: "reason",
						description: "The reason for un-banning the user",
						type: "STRING",
						required: false,
					},
					{
						name: lang.SHOW_COMMAND_OPTION_NAME,
						description: lang.SHOW_COMMAND_OPTION_DESCRIPTION,
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ["954566055328612352"],
			},
		);
	}
}
