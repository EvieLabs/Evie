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

import type { CommandInteraction } from "discord.js";
import si from "systeminformation";
import { axo } from "../axologs";

export default {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Stats about me and TristanSMP"),
  async execute(interaction: CommandInteraction) {
    // Make an embed

    const exampleEmbed = await EvieEmbed(interaction.guild);

    // Vars

    // Actions

    // N/a

    // Embed It!

    const cpu = await si.cpu();
    exampleEmbed
      .addField(
        "<:evie:898393916812976159> Evie Stats <:evie:898393916812976159>",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        false
      )
      .addField("My VPS's CPU:", cpu.brand, true)
      .addField(
        "Discord Lib:",
        "I'm Running discord.js inside of a child process in c#",
        true
      )
      .addField(
        `My Average Response Time:`,
        `${interaction.client.ws.ping.toString()}ms`,
        true
      )
      .addField("My CPU's Core Count:", cpu.cores.toString(), true)
      .addField("My CPU's Speed:", `${cpu.speedMax.toString()}GHz`, true)
      .addField(
        "<a:tlogo:898393556878786560> Discord Server Stats <a:tlogo:898393556878786560>",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        false
      )
      .addField(
        "Discord Server Members:",
        interaction.guild!.memberCount.toString(),
        true
      );

    await interaction
      .guild!.members.fetch()
      .then((data) =>
        exampleEmbed.addField(
          "Tristan SMP Members:",
          interaction
            .guild!.roles.cache.find((role) => role.name == "TSMPMember")!
            .members.size.toString(),
          true
        )
      )
      .catch((error) => axo.err(error));

    await interaction
      .guild!.members.fetch()
      .then((data) =>
        exampleEmbed.addField(
          "Staff Members:",
          interaction
            .guild!.roles.cache.find((role) => role.name == "Staff")!
            .members.size.toString(),
          true
        )
      )
      .catch((error) => axo.err(error));

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
