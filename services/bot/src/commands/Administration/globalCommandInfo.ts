import ShapeGlobalCommandsToChoices from "#root/utils/misc/ShapeGlobalCommandsToChoices";
import { time } from "@discordjs/builders";
import { adminGuilds } from "@evie/config";
import { EvieEmbed, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior } from "@sapphire/framework";
import { AutocompleteInteraction, CommandInteraction, SnowflakeUtil } from "discord.js";
@ApplyOptions<Command.Options>({
	description: "Get information about global commands.",
	preconditions: ["OwnerOnly"],
})
export class GlobalCommandInfo extends Command {
	public override async chatInputRun(interaction: CommandInteraction): Promise<void> {
		const query = interaction.options.getString("query");
		if (!query) return;
		const command = await this.container.client.application?.commands.fetch(query);
		if (!command) return void ReplyStatusEmbed(false, "No command found.", interaction);
		const a = "➤";
		const embed = new EvieEmbed();
		embed.setTitle(command.name);
		embed.setDescription(`${a} **Description**: \`${command.description}\`
    ${a} **ID**: \`${command.id}\`
    ${a} **Registered**: ${time(SnowflakeUtil.deconstruct(command.id).date, "R")}`);
		void interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
		await interaction.respond(await ShapeGlobalCommandsToChoices(interaction));
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "query",
						description: "Command to view",
						type: "STRING",
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				guildIds: adminGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			},
		);
	}
}
