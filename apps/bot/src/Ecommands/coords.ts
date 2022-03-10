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
import { EvieEmbed } from "#classes/EvieEmbed";

import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coords")
    .setDescription("Spits a random set of coords on tristansmp.com"),
  async execute(interaction: CommandInteraction) {
    const idk_msg = [
      "a Stronghold at `1464 ~ 584` ",
      "an Igloo at `5904 ~ -4816`",
      "a Jungle Pyramid at `2864 ~ -336`",
      "a Mansion at `17488 ~ 1568`",
      "a Mineshaft at `864 ~ 224`",
      "a Monument at `2256 ~ -1456`",
      "a Pillager Outpost at `-320 ~ 1360`",
      "a Shipwreck at `400 ~ 192`",
      "Soap's Mob Farm at `1784 ~ 1141`",
      "Soap's Village & Farm at `2269 ~ 1633`",
      "Ice's Castle at `760 70 7263`",
      "John's Cruncated Octahedron at `710 146 -6953`",
      "Ice Spike Monument at `-58863 73 -7940`",
      // ``
    ];
    const exampleEmbed = await EvieEmbed(interaction.guild);
    const index = Math.floor(Math.random() * (idk_msg.length - 1) + 1);
    exampleEmbed.addField(
      "Here's a random landmark in the overworld on `tristansmp.com`",
      `theres ${idk_msg[index]}`
    );
    exampleEmbed.addField(
      `Hey, ${interaction.user.username.toString()} want your landmark added to this command?`,
      "If so directly contact Tristan with the command `/dmtristan <message>` in <#877795126615879750>"
    );
    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
