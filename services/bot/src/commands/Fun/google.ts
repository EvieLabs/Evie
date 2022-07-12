import { registeredGuilds } from "@evie/config";
import { StatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command, RegisterBehavior } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { CommandInteraction, MessageAttachment } from "discord.js";
@ApplyOptions<ChatInputCommand.Options>({
	name: "Google",
	description: "Talk to the Google Assistant.",
})
export class Google extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const query = interaction.options.getString("query");

		if (!query) return;

		await interaction.deferReply();

		const { data: response } = await this.container.client.evieRest.post<{
			image: Buffer;
			audio: Buffer | null;
		}>("/private/gassistant/ask", {
			query,
		});

		const files: MessageAttachment[] = [];

		files.push(new MessageAttachment(Buffer.from(response.image), "image.png"));

		response.audio && files.push(new MessageAttachment(Buffer.from(response.audio), "audio.mp3"));

		void interaction.editReply({
			embeds:
				files.length === 0
					? [new StatusEmbed(false, await resolveKey(interaction, "commands/fun:noResponse"))]
					: undefined,
			files: files,
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
						name: "query",
						description: "Query to send to the Google Assistant",
						type: "STRING",
						required: true,
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
