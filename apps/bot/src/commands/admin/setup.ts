/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { modDB } from "#root/utils/database/modSettings";
import { checkPerm } from "#root/utils/misc/permChecks";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction, Permissions, TextChannel } from "discord.js";

export class Admin extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (
      !(await checkPerm(interaction.member, Permissions.FLAGS.ADMINISTRATOR))
    ) {
      await StatusEmbed(
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
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (missing role and/or guild)",
        interaction
      );
    try {
      await modDB.setStaffRole(guild, targetRole.id);
      return await StatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully set the staff role to ${targetRole}`,
        interaction
      );
    } catch (e) {
      return await StatusEmbed(
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
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "Something went wrong... (missing channel and/or guild)",
        interaction
      );

    if (
      !targetChannel
        .permissionsFor(guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "I do not have permission to send messages in chosen log channel.",
        interaction
      );
    }

    try {
      await modDB.setLogChannel(guild, targetChannel);
      return await StatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully set the log channel to ${targetChannel}`,
        interaction
      );
    } catch (e) {
      return await StatusEmbed(
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
