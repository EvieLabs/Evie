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
import { checkPerm } from "#root/utils/misc/permChecks";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  AutocompleteInteraction,
  CommandInteraction,
  Permissions,
} from "discord.js";

export class UnBan extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
      await StatusEmbed(
        StatusEmoji.FAIL,
        "You do not have the required permissions to un-ban users.",
        interaction
      );
      return;
    }
    const target = interaction.options.getString("user");

    if (!target) {
      await StatusEmbed(
        StatusEmoji.FAIL,
        "You must specify a user to ban.",
        interaction
      );
      return;
    }

    try {
      const user = await interaction.client.punishments.unBanGuildMember(
        target,
        interaction.guild
      );

      await StatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully unbanned ${user?.username}#${user?.discriminator}`,
        interaction
      );
      return;
    } catch (e) {
      StatusEmbed(StatusEmoji.FAIL, "Failed to un-ban user.", interaction);
      return;
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
      return await interaction.respond([
        {
          name: "Hey you don't have the required permissions to un-ban users.",
          value: "notadmin",
        },
      ]);
    }

    const bans = await interaction.guild.bans.fetch();
    const query = interaction.options.getString("query") ?? "";

    if (bans.size == 0) {
      return await interaction.respond([
        {
          name: "No bans found. Must be nice.",
          value: "nobans",
        },
      ]);
    }

    const sortedBans = bans
      .filter(
        (ban) =>
          ban.user.tag.toLowerCase().includes(query.toLowerCase()) ||
          ban.user.id.includes(query.toLowerCase())
      )
      .sort((a, b) => a.user.tag.localeCompare(b.user.tag));

    return await interaction.respond(
      sortedBans.map((ban) => {
        return {
          name: `🚫${ban.user.username}#${ban.user.discriminator}`,
          value: ban.user.id,
        };
      })
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Un-ban a user",
        options: [
          {
            name: "user",
            description: "The user to un-ban",
            type: "STRING",
            required: true,
            autocomplete: true,
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
