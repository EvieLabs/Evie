import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "updatehandbook",
	description: "Force update the Handbook",
	preconditions: ["OwnerOnly"],
	aliases: ["uhb"],
})
export class ForceVote extends Command {
	public override async messageRun(message: Message) {
		await this.container.client.handbook.checkForUpdates();

		await message.reply("Done!");
	}
}
