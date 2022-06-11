import { EvieEmbed } from "#root/classes/EvieEmbed";
import { Stats } from "#root/classes/Stats";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { GitHubRepo } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Evie git info.",
  name: "git",
  aliases: ["version", "ver"],
})
export class Git extends Command {
  public override async messageRun(message: Message) {
    return void message.reply({
      embeds: [
        new EvieEmbed() //
          .setDescription(
            removeIndents(
              `**Running Commit**: [${Stats.commitSha.slice(
                0,
                7
              )}](${GitHubRepo}/commit/${Stats.commitSha}) (${name}) #${
                Stats.commitNumber
              }
              **Branch**: [${Stats.currentBranch}](${GitHubRepo}/tree/${
                Stats.currentBranch
              })`
            )
          ),
      ],
    });
  }
}
