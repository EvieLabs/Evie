import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { checkPerm } from "#root/utils/misc/permChecks";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import { CommandInteraction, Permissions, TextChannel } from "discord.js";

export class Admin extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (
      !(await checkPerm(interaction.member, Permissions.FLAGS.ADMINISTRATOR))
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You do not have the required permissions to use this command. (admin)",
        interaction
      );
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "set_staff") {
      await this.setStaff(interaction);
      return;
    } else if (subcommand === "set_log") {
      await this.setLog(interaction);
      return;
    }
  }

  private async setStaff(interaction: CommandInteraction) {
    const guild = interaction.guild;
    const targetRole = interaction.options.getRole("role");
    if (!targetRole || !guild)
      return await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (missing role and/or guild)",
        interaction
      );
    try {
      await guild.client.prisma.guildSettings.update({
        where: {
          id: guild.id,
        },
        data: {
          moderatorRole: targetRole.id,
        },
      });
      return await ReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully set the staff role to ${targetRole}`,
        interaction
      );
    } catch (e) {
      Sentry.captureException(e);
      return await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (database error)",
        interaction
      );
    }
  }

  private async setLog(interaction: CommandInteraction) {
    const guild = interaction.guild;
    const targetChannel = interaction.options.getChannel("channel");
    if (
      !targetChannel ||
      !guild ||
      !(targetChannel instanceof TextChannel) ||
      !guild.me
    )
      return await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (missing channel and/or guild)",
        interaction
      );

    if (
      !targetChannel
        .permissionsFor(guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "I do not have permission to send messages in chosen log channel.",
        interaction
      );
    }

    try {
      await guild.client.prisma.guildSettings.update({
        where: {
          id: guild.id,
        },
        data: {
          moderationSettings: {
            update: {
              logChannel: targetChannel.id,
            },
          },
        },
      });
      return await ReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully set the log channel to ${targetChannel}`,
        interaction
      );
    } catch (e) {
      Sentry.captureException(e);
      return await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (database error)",
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
          .setDescription("Setup Evie for your server")
          .addSubcommand((subcommand) =>
            subcommand
              .setName("set_staff")
              .setDescription("Set the staff role")
              .addRoleOption((role) =>
                role
                  .setDescription("The role of the staff role")
                  .setName("role")
                  .setRequired(true)
              )
          )
          .addSubcommand((subcommand) =>
            subcommand
              .setName("set_log")
              .setDescription("Set the log channel")
              .addChannelOption((channel) =>
                channel
                  .setDescription("The log channel")
                  .setName("channel")
                  .setRequired(true)
              )
          ),
      {
        guildIds: registeredGuilds,
      }
    );
  }
}
