import {
  EditReplyStatusEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import ValorantStatsComponent from "#root/components/stats/ValorantStatsComponent";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { fetchAccountData } from "@evie/valorant";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  ChatInputCommand,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { CommandInteraction } from "discord.js";
import React from "react";

@ApplyOptions<ChatInputCommand.Options>({
  description: "View VALORANT stats for a player.",
})
export class ValorantStats extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const username = interaction.options.getString("username");
    const tag = interaction.options.getString("tag");

    if (!username || !tag)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Missing username or tag argument.",
        interaction
      );

    await interaction.deferReply();

    try {
      const res = await fetchAccountData({
        name: username,
        tag,
      });

      return void interaction.client.reacord.editReply(
        interaction,
        <ValorantStatsComponent user={interaction.user} account={res} />
      );
    } catch (e) {
      captureException(e);
      return void EditReplyStatusEmbed(
        StatusEmoji.FAIL,
        "No account found.",
        interaction
      );
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((string) =>
            string
              .setDescription("Username of the player.")
              .setName("username")
              .setRequired(true)
          )
          .addStringOption((string) =>
            string
              .setDescription("Tag of the player.")
              .setName("tag")
              .setRequired(true)
          ),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["971746099360575518"],
      }
    );
  }
}
