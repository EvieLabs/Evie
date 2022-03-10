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

import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, TextBasedChannel } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announces a message to the announcement channel")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What should I send?")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.user.toString() == "<@97470053615673344>") {
      const announceChannel = interaction.client.channels.cache.get(
        "902455135609970698"
      ) as TextBasedChannel;
      try {
        announceChannel?.send(`${interaction.options.getString("message")}`);
      } catch (error) {
        console.log(error);
      }
      await interaction.reply({ content: "Sent!", ephemeral: true });
    } else {
      await interaction.reply({
        content: "Hey your not one of my devs! Good try tho ;)",
        ephemeral: true,
      });
    }
  },
};
