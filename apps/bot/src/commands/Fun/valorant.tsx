import { botInvite } from "#root/utils/builders/stringBuilder";
import { registeredGuilds } from "@evie/config";
import { EvieEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command, RegisterBehavior } from "@sapphire/framework";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<ChatInputCommand.Options>({
	description: "View VALORANT stats for a player.",
})
export class ValorantStats extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		interaction.reply({
			embeds: [new EvieEmbed().setDescription("`/valorant` has split apart from Evie and is now a separate bot!")],
			components: [
				new MessageActionRow().addComponents([
					new MessageButton().setLabel("Invite Valor").setURL(botInvite("1033189819418943588")).setStyle("LINK"),
				]),
			],
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((string) =>
						string.setDescription("Username of the player.").setName("username").setRequired(true),
					)
					.addStringOption((string) => string.setDescription("Tag of the player.").setName("tag").setRequired(true)),
			{
				guildIds: registeredGuilds,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ["971746099360575518"],
			},
		);
	}
}
