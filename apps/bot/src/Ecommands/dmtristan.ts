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
import type { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("dmtristan")
    .setDescription("Adds a line of text to my memory core")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What should I send to him?")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: "Sent!", ephemeral: true });

    const msg = interaction.options.getString("message");
    // append string to your file
    await interaction.guild?.members
      .fetch()
      .then((data) =>
        interaction.client.users.cache
          .get("97470053615673344")
          ?.send(`${interaction.user.tag.toString()} said: ${msg}`)
      )
      .catch((error: any) => console.log(error));
  },
};
