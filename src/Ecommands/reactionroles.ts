import { SlashCommandBuilder } from "@discordjs/builders";
import * as evie from "../tools";
import {
  MessageEmbed,
  Channel,
  Interaction,
  CommandInteraction,
  Role,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { axo } from "../axologs";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionroles")
    .setDescription("Evie's Reaction Roles Options")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("make")
        .setDescription("Make a reaction role embed!")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message of the embed")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to give to the user")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the embed in")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "make") {
      const msg = interaction.options.getString("message");
      const role: Role = interaction.options.getRole("role");
      const channel = interaction.options.getChannel("channel");
      let embed = await evie.embed(interaction.guild);
      embed.setDescription(msg);
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel(role.name)
          .setStyle("PRIMARY")
          .setCustomId(`RR${role.id}`)
      );
      try {
        await channel.send({
          embeds: [embed],
          components: [row],
        });
      } catch (error) {
        const e = await evie.embed(interaction.guild);
        e.setDescription(
          "Error: Please make sure my Role is above the role you want to give out."
        );
        await interaction.reply({ embeds: [e] });
      }
    }
  },
};
