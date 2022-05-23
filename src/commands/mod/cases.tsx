import {
  EditReplyStatusEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import CasesComponent from "#root/components/info/CasesComponent";
import lang from "#root/utils/lang";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import { CommandInteraction, SnowflakeUtil } from "discord.js";
import React from "react";
@ApplyOptions<Command.Options>({
  description: "View cases",
  preconditions: ["ModOrBanPermsOnly"],
})
export class Cases extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const moderator = interaction.options.getUser("moderator");
    const target = interaction.options.getUser("target");
    const show = !interaction.options.getBoolean("show") ?? false;

    if (!moderator && !target) {
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        lang.noModOrTarget,
        interaction
      );
    }

    await interaction.deferReply({ ephemeral: show, fetchReply: true });

    try {
      const modLog = await interaction.client.guildLogger.getModChannel(
        interaction.guild
      );

      const cases = (
        await interaction.client.prisma.modAction.findMany({
          where: {
            targetID: target?.id,
            moderatorID: moderator?.id,
            guildId: interaction.guild.id,
          },
        })
      ).sort(
        (a, b) =>
          SnowflakeUtil.deconstruct(b.id).date.getTime() -
          SnowflakeUtil.deconstruct(a.id).date.getTime()
      );

      return void interaction.client.reacord.editReply(
        interaction,
        <CasesComponent modLog={modLog} cases={cases} user={interaction.user} />
      );
    } catch (e) {
      Sentry.captureException(e);
      EditReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Failed to pull up cases.",
        interaction
      );
      return;
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "moderator",
            description: "View cases from",
            type: "USER",
            required: false,
          },
          {
            name: "target",
            description: "View cases for",
            type: "USER",
            required: false,
          },
          {
            name: "show",
            description: "Send the message non-ephemerally",
            type: "BOOLEAN",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
