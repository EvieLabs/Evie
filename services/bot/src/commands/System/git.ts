import { removeIndents } from "#root/utils/builders/stringBuilder";
import { GitHubRepo } from "@evie/config";
import { EvieEmbed, Stats } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
@ApplyOptions<Command.Options>({
	description: "Evie git info.",
	name: "git",
	aliases: ["version", "ver"],
})
export class Git extends Command {
	public override messageRun(message: Message) {
		return void message.reply({
			embeds: [
				new EvieEmbed() //
					.setDescription(
						removeIndents(
							`**Running Commit**: [${Stats.commitSha.slice(0, 7)}](${GitHubRepo}/commit/${Stats.commitSha}) (${
								Stats.commitName
							}) #${Stats.commitNumber}
              **Branch**: [${Stats.currentBranch}](${GitHubRepo}/tree/${Stats.currentBranch})`,
						),
					),
			],
		});
	}
}
