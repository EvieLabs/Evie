import { SlashCommandBuilder } from "@discordjs/builders";
import * as evie from "../tools";
import {
  CommandInteraction,
  Role,
  MessageActionRow,
  MessageButton,
  TextChannel,
  MessageSelectMenu,
  SelectMenuInteraction,
  Permissions,
  GuildMember,
} from "discord.js";
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("joinrole")
        .setDescription("Make a reaction role embed!")
        .addBooleanOption((option) =>
          option
            .setName("enable")
            .setDescription("Enable join role?")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to give to the user on join")
            .setRequired(false)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const perms: Permissions = interaction.member.permissions as Permissions;
    if (perms.has(Permissions.FLAGS.MANAGE_ROLES)) {
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
            try {
              await channel?.send({
                embeds: [embed],
                components: [row],
              });
              const e = await evie.embed(interaction.guild!);
              e.setDescription(
                `Sent! Members can now click the buttons sent in ${channel} to toggle applying and unapplying ${roleArray}. You can also now click dismiss on all these messages to make them disappear 👻`
              );
              await i.reply({ embeds: [e], ephemeral: true });
            } catch (error) {
              const e = await evie.embed(interaction.guild!);
              e.setDescription(
                `Error: Please make sure I have permission to send messages in ${channel}.`
              );
              await i.reply({ embeds: [e], ephemeral: true });
            }
          } else if (i.customId === "cancelpreprole") {
            const e = await evie.embed(interaction.guild!);
            e.setDescription(`Cancelled!`);
            await i.reply({ embeds: [e], ephemeral: true });
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
            await i.reply({ embeds: [e], components: [row], ephemeral: true });
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
                i.reply({
                  embeds: [e],
                  components: [row],
                  ephemeral: true,
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
      if (subcommand == "joinrole") {
        const enable: boolean = interaction.options.getBoolean("enable")!;
        const role: Role = interaction.options.getRole("role")! as Role;
        await interaction.deferReply({ ephemeral: true });
        if (enable) {
          if (role) {
            try {
              await evie.setJoinRole(interaction.guild!, role);
            } catch (error) {
              interaction.editReply({
                content:
                  "Error: Couldn't write role to my database. Try again or report it to our support server https://discord.gg/82Crd8tZRF",
              });
            }
            await evie.setJoinRoleEnable(interaction.guild!, true);
            const e = await evie.embed(interaction.guild!);
            e.setDescription(
              `Successfully enabled and set the join role to ${role}. New members will automatically get ${role} applied to them (unless their a bot).`
            );
            interaction.editReply({
              embeds: [e],
            });
          } else {
            const e = await evie.embed(interaction.guild!);
            e.setDescription(
              `Error: You didn't specify a role. Please try again.`
            );
            interaction.editReply({
              embeds: [e],
            });
          }
        } else {
          await evie.setJoinRoleEnable(interaction.guild!, false);
          const e = await evie.embed(interaction.guild!);
          e.setDescription(`Disabled Join Role`);
          interaction.editReply({
            embeds: [e],
          });
        }
      }
    } else {
      const e = await evie.embed(interaction.guild!);
      e.setDescription("Error: You don't have `Manage Roles` Permission!");
      interaction.reply({
        embeds: [e],
      });
    }
  },
};
