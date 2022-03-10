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

import type { CommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
    .setName("timeline")
    .setDescription(
      "Sends an image of the last timeline generated for tristansmp.com"
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      "https://cdn.discordapp.com/attachments/819719663289106514/890097693014261770/unknown.png"
    );
  },
};
