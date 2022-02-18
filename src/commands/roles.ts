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
  Message,
  MessageComponentInteraction,
  Guild,
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
    const perms: Permissions = interaction.member?.permissions as Permissions;
    if (perms.has(Permissions.FLAGS.MANAGE_ROLES)) {
      if (subcommand == "buttonrole") {
        async function prepScreen(
          guild: Guild,
          channel: TextChannel,
          msg: string
        ) {
          const e = await evie.embed(guild);
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
          return { embeds: [e], components: [row] };
        }

        let msg: string = interaction.options
          .getString("message")!
          .replace("\\n", "\n");
        let role: Role = interaction.options.getRole("role") as Role;
        let channel: TextChannel = interaction.options.getChannel(
          "channel"
        ) as TextChannel;
        let roleArray: Role[] = [role];

        interaction.reply(await prepScreen(interaction.guild!, channel, msg));
        const filter = (i) =>
          i.customId === "confirmpreprole" ||
          i.customId === "cancelpreprole" ||
          (i.customId === "addrolepreprole" &&
            i.channel.id === interaction.channel!.id);
        const collector = interaction.channel!.createMessageComponentCollector({
          filter,
          time: 300000,
        });
        collector.on("collect", async (i) => {
          if (i.user.id === interaction.user.id) {
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
                  `Sent! Members can now click the buttons sent in ${channel} to toggle applying and unapplying ${roleArray}.`
                );
                await i.update({ embeds: [e] });
              } catch (error) {
                const e = await evie.embed(interaction.guild!);
                e.setDescription(
                  `Error: Please make sure I have permission to send messages in ${channel}.`
                );
                await i.update({ embeds: [e], components: [] });
              }
            } else if (i.customId === "cancelpreprole") {
              const e = await evie.embed(interaction.guild!);
              e.setDescription(`Cancelled!`);
              await i.update({ embeds: [e], components: [] });
            } else if (i.customId === "addrolepreprole") {
              const selections = new MessageSelectMenu();
              const guildRoles: {
                label: string;
                value: string;
              }[] = [];
              interaction.guild!.roles.cache.forEach((role) => {
                guildRoles.push({ label: role.name, value: role.id });
              });
              if (guildRoles.length <= 25) {
                selections.addOptions(guildRoles).setCustomId("addToRoleArray");
                const row = new MessageActionRow().addComponents(selections);
                const e = await evie.embed(interaction.guild!);
                e.setDescription(
                  `Select the role you want to add to the message.`
                );
                await i.update({
                  embeds: [e],
                  components: [row],
                });
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
                    i.update(
                      await prepScreen(interaction.guild!, channel, msg)
                    );
                  }
                });
              } else {
                let allDone: boolean = false;
                await i
                  .update({
                    content: "Please ping a role to add!",
                    components: [],
                    embeds: [],
                  })
                  .then();
                const collector = i.channel!.createMessageCollector({
                  filter: (m) => m.author.id === i.user.id,
                  time: 30000,
                  max: 1,
                });
                collector.on("end", (collected) => {
                  if (!allDone) {
                    expireIt(i);
                  }
                });
                collector.on("collect", async (m: Message) => {
                  const role: Role = m.mentions.roles.first()!;
                  if (role) {
                    allDone = true;
                    roleArray.push(role);
                    m.reply(await prepScreen(interaction.guild!, channel, msg));
                  } else {
                    const er = await evie.embed(interaction.guild!);
                    er.setDescription(
                      `Error: You didn't specify a role. Please try again.`
                    );
                    m.reply({
                      embeds: [er],
                    });
                    m.reply(await prepScreen(interaction.guild!, channel, msg));
                  }
                });
              }
            }
          } else {
            i.reply({
              content: "Hey this button isn't for you!",
              ephemeral: true,
            });
          }
        });
        collector.on("end", (collected) => expireIt(interaction));
        function expireIt(
          interaction: CommandInteraction | MessageComponentInteraction
        ) {
          interaction.editReply({
            content: "Cancelled!",
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
              `Successfully enabled and set the join role to ${role}. New members will automatically get ${role} applied to them (unless they are a bot).`
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
        ephemeral: true,
      });
    }
  },
};
