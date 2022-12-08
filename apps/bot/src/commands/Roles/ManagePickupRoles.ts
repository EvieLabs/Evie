import { ShapePickupRolesToChoices } from "#root/lib/shapers/PickupRoles";
import { registeredGuilds } from "@evie/config";
import { EditReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

@ApplyOptions<Command.Options>({
	description: "Manage pick-up-able roles.",
	requiredUserPermissions: ["ADMINISTRATOR"],
	preconditions: ["GuildOnly"],
})
export class ManagePickupRoles extends Command {
	public override chatInputRun(interaction: CommandInteraction): void {
		switch (interaction.options.getSubcommand()) {
			case "create": {
				return void this.createRole(interaction);
			}
			case "delete": {
				return void this.deleteRole(interaction);
			}
		}
	}

	private async deleteRole(interaction: CommandInteraction) {
		if (!interaction.guildId || !interaction.guild || !interaction.member) throw null;
		await interaction.deferReply({ ephemeral: true });
		const query = interaction.options.getString("query");

		if (!query) throw await resolveKey(interaction, "errors:queryMissing");

		return void (await interaction.client.prisma.pickupRole
			.delete({
				where: {
					roleID: query,
				},
			})
			.catch(async () => {
				throw await resolveKey(interaction, "commands/util/pickuprole:manageFailedToRemoveRole");
			})
			.then(
				async (role) =>
					void EditReplyStatusEmbed(
						true,
						await resolveKey(interaction, "commands/util/pickuprole:manageSuccessRemove", {
							role: { id: role.roleID },
						}),
						interaction,
					),
			));
	}

	private async createRole(interaction: CommandInteraction) {
		if (!interaction.guildId || !interaction.guild || !interaction.member) throw null;
		await interaction.deferReply({ ephemeral: true });
		const role = interaction.options.getRole("role");

		if (!role) throw await resolveKey(interaction, "errors:missingCommandOption");

		try {
			await interaction.client.prisma.pickupRole.create({
				data: {
					roleID: role.id,
					guildID: interaction.guildId,
				},
			});
		} catch (e) {
			throw await resolveKey(interaction, "commands/util/pickuprole:manageFailedToAddRole");
		} finally {
			void EditReplyStatusEmbed(
				true,
				await resolveKey(interaction, "commands/util/pickuprole:manageSuccessAdd", { role }),
				interaction,
			);
		}
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
		await interaction.respond(await ShapePickupRolesToChoices(interaction));
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((createSub) =>
						createSub //
							.setName("create")
							.setDescription("Create a pick-up-able role.")
							.addRoleOption((role) =>
								role //
									.setName("role")
									.setDescription("The role that users can pick up.")
									.setRequired(true),
							),
					)
					.addSubcommand((deleteSub) =>
						deleteSub //
							.setName("delete")
							.setDescription("Delete a pick-up-able role.")
							.addStringOption((query) =>
								query //
									.setName("query")
									.setDescription("The name of the role.")
									.setRequired(true)
									.setAutocomplete(true),
							),
					),

			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			},
		);
	}
}
