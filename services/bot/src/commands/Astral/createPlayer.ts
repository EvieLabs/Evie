import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "createplayer",
	description: "Manually create a player",
	preconditions: ["OwnerOnly"],
})
export class CreatePlayer extends Command {
	public override async messageRun(message: Message, args: Args) {
		const user = await args.pick("user").catch(() => message.author);

		await this.container.client.prisma.astralPlayer.create({
			data: {
				id: user.id,
			},
		});

		await message.reply(`Inserted an astral player manually for ${user.toString()}`);
	}
}
