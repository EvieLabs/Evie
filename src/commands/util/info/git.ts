import { EvieEmbed } from "#root/classes/EvieEmbed";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { GitHubRepo } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { execSync } from "node:child_process";
@ApplyOptions<Command.Options>({
  description: "Evie git info.",
  name: "git",
  aliases: ["version", "ver"],
})
export class Git extends Command {
  public override async messageRun(message: Message) {
    const sha = execSync("git rev-parse HEAD").toString().trim();
    const name = execSync("git log -1 --pretty=%an").toString().trim();
    const commitNumber = execSync("git rev-list --all --count")
      .toString()
      .trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim();

    return void message.reply({
      embeds: [
        new EvieEmbed() //
          .setDescription(
            removeIndents(
              `**Running Commit**: [${sha.slice(
                0,
                7
              )}](${GitHubRepo}/commit/${sha}) (${name}) #${commitNumber}
              **Branch**: [${branch}](${GitHubRepo}/tree/${branch})`
            )
          ),
      ],
    });
  }
}
