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

import type { CommandInteraction, ContextMenuInteraction } from "discord.js";

export enum PermissionLang {
  MANAGE_SERVER = "Hey, you must have the `Manage Server` permission to use this command.",
  MANAGE_MESSAGES = "Hey, you must have the `Manage Messages` permission to use this command.",
}

export async function informNeedsPerms(
  interaction: CommandInteraction | ContextMenuInteraction,
  perm: PermissionLang
) {
  if (interaction.replied) {
    await interaction.editReply({
      content: perm,
      embeds: [],
      components: [],
    });
    return;
  } else {
    interaction.reply({
      content: perm,
      ephemeral: true,
    });
    return;
  }
}
