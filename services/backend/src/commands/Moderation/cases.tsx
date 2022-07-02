import PaginateComponent from "#root/components/info/PaginateComponent";
import {
  constructMessageLink,
  removeIndents,
} from "#root/utils/builders/stringBuilder";
import { time } from "@discordjs/builders";
import { lang, registeredGuilds } from "@evie/config";
import { EditReplyStatusEmbed, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
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
        false,
        await resolveKey(interaction, "commands/mod/cases:noModOrTarget"),
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

      const casesFormatted = cases.map((case_) => {
        return {
          description: removeIndents(
            `**Case**: [#${case_.id}](${constructMessageLink(
              modLog,
              case_.logMessageID ?? case_.id
            )}) (${case_.type || `\`${case_.typeId}\``})
      **Reason**: ${case_.reason}
      ${`**Moderator**: ${case_.moderatorName ?? "Automated"} (\`${
        case_.moderatorID ?? "Automated"
      }\`)`}
      ${`**Target**: ${case_.targetName} (\`${case_.targetID}\`)`}
      ${`**Time**: ${time(SnowflakeUtil.deconstruct(case_.id).date)}`}`
          ),
        };
      });

      return void interaction.client.reacord.editReply(
        interaction,
        <PaginateComponent pages={casesFormatted} user={interaction.user} />
      );
    } catch (e) {
      Sentry.captureException(e);
      EditReplyStatusEmbed(false, "Failed to pull up cases.", interaction);
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
            name: lang.SHOW_COMMAND_OPTION_NAME,
            description: lang.SHOW_COMMAND_OPTION_DESCRIPTION,
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
