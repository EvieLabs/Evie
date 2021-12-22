export {};

import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import si from "systeminformation";
import { axo } from "../axologs";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Stats about me and TristanSMP"),
  async execute(interaction, client) {
    // Make an embed

    let exampleEmbed = await embed(interaction.guild);

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
        interaction.client.ws.ping.toString() + "ms",
        true
      )
      .addField("My CPU's Core Count:", cpu.cores.toString(), true)
      .addField("My CPU's Speed:", cpu.speedMax.toString() + "GHz", true)
      .addField(
        "<a:tlogo:898393556878786560> Discord Server Stats <a:tlogo:898393556878786560>",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        false
      )
      .addField(
        "Discord Server Members:",
        interaction.guild.memberCount.toString(),
        true
      );

    await interaction.guild.members
      .fetch()
      .then((data) =>
        exampleEmbed.addField(
          "Tristan SMP Members:",
          interaction.guild.roles.cache
            .find((role) => role.name == "TSMPMember")
            .members.size.toString(),
          true
        )
      )
      .catch((error) => axo.err(error));

    await interaction.guild.members
      .fetch()
      .then((data) =>
        exampleEmbed.addField(
          "Staff Members:",
          interaction.guild.roles.cache
            .find((role) => role.name == "Staff")
            .members.size.toString(),
          true
        )
      )
      .catch((error) => axo.err(error));

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
