import { inlineCode } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Message, MessageAttachment } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "fetchconfig",
	description: "Fetch the config of the current guild",
	preconditions: ["OwnerOnly"],
	aliases: ["fc"],
})
export class FetchConfig extends Command {
	public override async messageRun(message: Message) {
		if (!message.inGuild()) {
			return message.reply("This command is only available in guilds.");
		}

		const config = await this.container.client.prisma.guildSettings.findFirst({
			where: {
				id: message.guildId,
			},
		});

		if (!config) {
			return void message.reply("This guild has no config.");
		}

		return void message.reply({
			content: `Guild Config for ${inlineCode(message.guildId)}`,
			files: [
				new MessageAttachment(Buffer.from(JSON.stringify(config, null, 2)), `${message.guildId}-guild-config.json`),
			],
		});
	}
}
