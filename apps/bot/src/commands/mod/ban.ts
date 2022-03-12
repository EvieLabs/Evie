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

import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class Ban extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const user = interaction.message.mentions.users.first();
    const reason = interaction.message.content.slice(
      interaction.prefix.length + 5
    );
    if (!user) return interaction.reply("Please mention a user to ban.");
    if (!reason)
      return interaction.reply("Please provide a reason for the ban.");
    if (user.id === interaction.message.author.id)
      return interaction.reply("You cannot ban yourself.");
    if (user.id === interaction.client.user.id)
      return interaction.reply("You cannot ban me.");
    if (user.id === interaction.client.owner.id)
      return interaction.reply("You cannot ban the owner.");
    if (interaction.message.guild.members.cache.get(user.id).bannable) {
      await interaction.message.guild.members.ban(user, { reason });
      return interaction.reply(`Banned ${user.tag} for ${reason}.`);
    }
    return interaction.reply("I cannot ban this user.");
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
            name: "length",
            description: "Length of the ban",
            type: "STRING",
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
