import { getAstralPlayer } from "@astral/utils";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "addxp",
	description: "Manually give xp to a player",
	preconditions: ["OwnerOnly"],
	aliases: ["givexp"],
})
export class AddXp extends Command {
	public override async messageRun(message: Message, args: Args) {
		const member = await args.pick("member").catch(() => message.member);
		if (!member) throw "Failed to fetch member. (try again)";

		const amount = await args.pick("number").catch(() => {
			throw "You need to specify a number.";
		});

		const player = await getAstralPlayer(member).catch(() => {
			throw "Failed to fetch player. (try again)";
		});

		await player.addExperience(amount).catch(() => {
			throw "Failed to add xp. (try again)";
		});

		await message.reply(`Added ${amount} xp to ${member.toString()} | ${player.level} level (${player.xp} xp)`);
	}
}
