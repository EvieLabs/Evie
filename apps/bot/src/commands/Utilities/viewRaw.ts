import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, RegisterBehavior } from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuInteraction, MessageAttachment } from "discord.js";
@ApplyOptions<Command.Options>({
	description: "View raw JSON of a message",
})
export class ViewRaw extends Command {
	public override contextMenuRun(interaction: ContextMenuInteraction) {
		const message = interaction.options.getMessage("message");

		if (!message) throw new Error("Message not found");

		void interaction.reply({
			ephemeral: true,
			files: [new MessageAttachment(Buffer.from(JSON.stringify(message, null, 2)), `${message.id}.json`)],
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerContextMenuCommand(
			(builder) =>
				builder //
					.setName("View Raw")
					.setType(ApplicationCommandType.Message),
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			},
		);
	}
}
