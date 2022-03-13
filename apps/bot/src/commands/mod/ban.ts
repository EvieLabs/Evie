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
import { punishDB } from "#root/utils/database/punishments";
import { checkPerm } from "#root/utils/misc/permChecks";
import { banGuildMember } from "#root/utils/punishments/ban";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { time } from "@discordjs/builders";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { CommandInteraction, Permissions } from "discord.js";

export class Ban extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "You do not have the required permissions to ban users.",
        interaction
      );
    }
    const userToBeBanned = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const days = interaction.options.getNumber("days");
    const expiresAt = days ? new Date(Date.now() + days * 86400000) : undefined;

    if (!userToBeBanned) {
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "You must specify a user to ban.",
        interaction
      );
    }

    if (await punishDB.getBan(userToBeBanned)) {
      await punishDB.deleteBan(userToBeBanned.id, interaction.guild);
    }

    try {
      await banGuildMember(
        userToBeBanned,
        {
          reason: reason ?? "No reason provided.",
        },
        expiresAt
      );
      return await StatusEmbed(
        StatusEmoji.SUCCESS,
        `Banned ${userToBeBanned} (${userToBeBanned.displayName}) ${
          expiresAt ? time(expiresAt, "R") : `indefinitely`
        } for \`${reason ?? "no reason :("}\`.`,
        interaction
      );
    } catch (e) {
      return StatusEmbed(StatusEmoji.FAIL, "Failed to ban user.", interaction);
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Ban a user",
        options: [
          {
            name: "user",
            description: "The user to ban",
            type: "USER",
            required: true,
          },
          {
            name: "days",
            description: "Days to ban the user for",
            type: "NUMBER",
            required: false,
            autocomplete: true,
          },
          {
            name: "reason",
            description: "Reason for the ban",
            type: "STRING",
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
