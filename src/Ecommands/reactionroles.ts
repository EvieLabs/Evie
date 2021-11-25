import { SlashCommandBuilder } from "@discordjs/builders";
import * as evie from "../tools";
import {
  CommandInteraction,
  Role,
  MessageActionRow,
  MessageButton,
  TextChannel,
  MessageSelectMenu,
  InteractionCollector,
  SelectMenuInteraction,
} from "discord.js";
import { axo } from "../axologs";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Evie's Reaction Roles Options")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("buttonrole")
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

  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "buttonrole") {
      const msg: string = interaction.options.getString("message")!;
      const role: Role = interaction.options.getRole("role") as Role;
      const channel: TextChannel = interaction.options.getChannel(
        "channel"
      ) as TextChannel;

      const roleArray: Role[] = [role];
      const e = await evie.embed(interaction.guild!);
      e.setTitle(`Info`);
      e.setDescription(
        `I'm about to send an embed into ${channel}, saying \`\`\`${msg}\`\`\` With the following button(s) attached to give out ${roleArray}`
      );
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Confirm!")
          .setStyle("PRIMARY")
          .setCustomId(`confirmpreprole`),
        new MessageButton()
          .setLabel("Cancel!")
          .setStyle("DANGER")
          .setCustomId(`cancelpreprole`),
        new MessageButton()
          .setLabel("Add Role!")
          .setStyle("PRIMARY")
          .setCustomId(`addrolepreprole`)
      );
      interaction.reply({ embeds: [e], components: [row], ephemeral: true });

      const filter = (i) =>
        i.customId === "confirmpreprole" ||
        i.customId === "cancelpreprole" ||
        (i.customId === "addrolepreprole" &&
          i.user.id === interaction.user.id &&
          i.channel.id === interaction.channel!.id);
      const collector = interaction.channel!.createMessageComponentCollector({
        filter,
        time: 300000,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "confirmpreprole") {
          try {
            let embed = await evie.embed(interaction.guild!);
            embed.setDescription(msg);
            const row = new MessageActionRow();
            roleArray.forEach((role) => {
              row.addComponents(
                new MessageButton()
                  .setLabel(role.name)
                  .setStyle("PRIMARY")
                  .setCustomId(`RR${role.id}`)
              );
            });
            await channel?.send({
              embeds: [embed],
              components: [row],
            });
            i.reply("Sent!");
          } catch (error) {
            const e = await evie.embed(interaction.guild!);
            e.setDescription(
              `Error: Please make sure I have permission to send messages in ${channel}.`
            );
            await interaction.editReply({ embeds: [e] });
          }
        } else if (i.customId === "cancelpreprole") {
          const e = await evie.embed(interaction.guild!);
          e.setDescription(`Cancelled!`);
          await interaction.editReply({ embeds: [e] });
        } else if (i.customId === "addrolepreprole") {
          const selections = new MessageSelectMenu();
          const guildRoles: {
            label: string;
            value: string;
          }[] = [];
          interaction.guild!.roles.cache.forEach((role) => {
            guildRoles.push({ label: role.name, value: role.id });
          });
          selections.addOptions(guildRoles).setCustomId("addToRoleArray");
          const row = new MessageActionRow().addComponents(selections);
          const e = await evie.embed(interaction.guild!);
          e.setDescription(`Select the role you want to add to the message.`);
          await interaction.editReply({ embeds: [e], components: [row] });

          const filter = (i) =>
            i.customId === "addToRoleArray" &&
            i.user.id === interaction.user.id &&
            i.channel.id === interaction.channel!.id;
          const collector =
            interaction.channel!.createMessageComponentCollector({
              filter,
              time: 300000,
            });
          collector.on("end", (collected) => expireIt(interaction));
          collector.on("collect", async (i: SelectMenuInteraction) => {
            if (i.customId === "addToRoleArray") {
              const role: Role = i.guild!.roles.cache.find(
                (r) => r.id == i.values[0]
              ) as Role;
              roleArray.push(role);
              const e = await evie.embed(interaction.guild!);
              e.setTitle(`Info`);
              e.setDescription(
                `I'm about to send an embed into ${channel}, saying \`\`\`${msg}\`\`\` With the following button(s) attached to give out ${roleArray}`
              );
              const row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setLabel("Confirm!")
                  .setStyle("PRIMARY")
                  .setCustomId(`confirmpreprole`),
                new MessageButton()
                  .setLabel("Cancel!")
                  .setStyle("DANGER")
                  .setCustomId(`cancelpreprole`),
                new MessageButton()
                  .setLabel("Add Role!")
                  .setStyle("PRIMARY")
                  .setCustomId(`addrolepreprole`)
              );
              interaction.editReply({
                embeds: [e],
                components: [row],
              });
            }
          });
        }
      });
      collector.on("end", (collected) => expireIt(interaction));
      function expireIt(interaction: CommandInteraction) {
        interaction.editReply({
          content: "Expired!",
          embeds: [],
          components: [],
        });
      }
    }
  },
};
