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
import { embed } from "../tools";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("Sets my Status!")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("What status")
        .setRequired(true)
        .addChoice("Do not Disturb", "dnd")
        .addChoice("Idle", "idle")
        .addChoice("Invisible", "invisible")
        .addChoice("Online", "online")
    )
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("Set my Activity to..")
        .setRequired(true)
    ),
  async execute(interaction) {
    const client = interaction.client;

    if (interaction.user.toString() == "<@97470053615673344>") {
      client.user.setPresence({
        status: interaction.options.getString("status"),
      });

      const activity = interaction.options.getString("activity");

      client.user.setActivity(activity, { type: "LISTENING" });

      await interaction.reply({
        content:
          "Setting my status to, " +
          "```" +
          interaction.options.getString("status") +
          "``` and setting my activity to ```" +
          activity +
          "```",
        ephemeral: false,
      });
    } else {
      await interaction.reply({
        content: "Hey! Your not one of my Devs!",
        ephemeral: true,
      });
    }
  },
};
