import { lang, registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior, Resolvers } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "jumbo",
	description: "Get the max size of an emoji",
})
export class Jumbo extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const option = interaction.options.getString("emoji");
		const ephemeral = !interaction.options.getBoolean("show") || false;

		if (!option) throw await resolveKey(interaction, "errors:missingCommandOption");

		const parsed = Resolvers.resolveEmoji(option);

		if (parsed.error) throw "Failed to parse emoji.";

		const emoji = parsed.value;

		if (!emoji.id || !emoji.name) throw "Failed to parse emoji.";

		return void (await interaction.reply({
			content: `[\`:${emoji.name}:\`](https://cdn.discordapp.com/emojis/${emoji.id}.${
				emoji.animated ? "gif" : "png"
			}?size=1024) | \`${emoji.id}\``,
			ephemeral,
		}));
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "emoji",
						description: "Emoji to jumbo-fy.",
						type: "STRING",
						required: true,
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
			},
		);
	}
}
