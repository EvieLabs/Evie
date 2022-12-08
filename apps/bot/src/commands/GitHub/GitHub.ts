import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";

@ApplyOptions<ChatInputCommand.Options>({
	description: "Fetch information from GitHub",
})
export class GitHub extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "repo",
						description: "Fetch information from a specific GitHub repository",
						type: "SUB_COMMAND",
						options: [
							{
								name: "owner",
								description: "The owner of the repository.",
								type: "STRING",
								required: true,
							},
							{
								name: "repo",
								description: "The name of the repository.",
								type: "STRING",
								required: true,
							},
						],
					},
				],
			},
			{
				guildIds: registeredGuilds,
			},
		);
	}
}
