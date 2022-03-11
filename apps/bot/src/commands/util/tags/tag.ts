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

import { EvieEmbed } from "#root/classes/EvieEmbed";
import { tagDB } from "#root/utils/database/tags";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

export class Tag extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    const query = interaction.options.getString("query");
    if (!interaction.guild) return;
    if (!query) return;
    const tag = await tagDB.getTagFromSnowflake(interaction.guild, query);
    if (!tag) {
      const tag = await tagDB.getClosestTagFromName(interaction.guild, query);
      if (tag) {
        const e = await EvieEmbed(interaction.guild);
        e.setTitle(tag.name);
        e.setDescription(tag.content);
        if (tag.embed) {
          interaction.reply({
            embeds: [e],
          });
        } else {
          interaction.reply({
            content: tag.content,
          });
        }
      } else {
        interaction.reply({
          content: `No tag found with the name \`${query}\``,
        });
      }
      return;
    }
    const e = await EvieEmbed(interaction.guild);
    e.setTitle(tag.name);
    e.setDescription(tag.content);
    if (tag.embed) {
      interaction.reply({
        embeds: [e],
      });
    } else {
      interaction.reply({
        content: tag.content,
      });
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    if (!interaction.guild) return;
    const tagData = await tagDB.getTags(interaction.guild);

    if (tagData.length == 0) {
      return await interaction.respond([
        {
          name: "📌Create a new tag with /createtag",
          value: "create",
        },
      ]);
    }
    return await interaction.respond(
      tagData.map((tag) => {
        return {
          name: `📌${tag.name}`,
          value: tag.id,
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
        description: "Send a tag",
        options: [
          {
            name: "query",
            description: "The name of the tag",
            type: "STRING",
            autocomplete: true,
            required: true,
          },
          {
            name: "target",
            description: "Targeted user",
            type: "USER",
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
