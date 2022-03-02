/* 
Copyright 2022 Tristan Camejo

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

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { EvieEmbed } from "../utils/classes/EvieEmbed";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("View my Privacy Policy"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "You can read it over here https://privacy.eviebot.rocks/",
      ephemeral: true,
    });
  },
};
