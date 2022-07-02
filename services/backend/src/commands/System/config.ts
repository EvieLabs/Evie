import { Emojis } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { configOptions, registeredGuilds } from "@evie/config";
import { EditReplyStatusEmbed, EvieEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Setup Evie for your server",
  preconditions: ["GuildOnly"],
})
export class Config extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "airport":
        return void this.Airport(interaction);
      case "evie":
        return void this.Evie(interaction);
      default:
        return void EditReplyStatusEmbed(
          false,
          "Invalid subcommand.",
          interaction
        );
    }
  }

  private async Evie(interaction: CommandInteraction) {
    if (!interaction.guildId) throw new Error();

    const options = {
      logChannel:
        interaction.options.getChannel("log-channel", false)?.id ?? undefined,
      moderatorRole:
        interaction.options.getRole("mod-role", false)?.id ?? undefined,
    };

    const modOptions = {
      logChannel:
        interaction.options.getChannel("case-channel", false)?.id ?? undefined,
    };

    const opts = await this.container.client.prisma.guildSettings.update({
      where: {
        id: interaction.guildId,
      },
      data: {
        ...options,
      },
    });

    const modOpts =
      await this.container.client.prisma.moderationSettings.update({
        where: {
          guildId: interaction.guildId,
        },
        data: {
          ...modOptions,
        },
      });

    interaction.editReply({
      embeds: [
        new EvieEmbed() //
          .setTitle("Evie Settings")
          .setDescription(
            removeIndents(
              `${
                opts.logChannel
                  ? `**Log Channel**: <#${opts.logChannel}>`
                  : `**Log Channel**: ${Emojis.disabled}`
              }\n${
                opts.moderatorRole
                  ? `**Moderator Role**: <@&${opts.moderatorRole}>`
                  : `**Arrive Message**: ${Emojis.disabled}`
              }\n${
                modOpts.logChannel
                  ? `**Case Channel**: <#${modOpts.logChannel}>`
                  : `**Case Channel**: ${Emojis.disabled}`
              }`
            )
          ),
      ],
    });
  }

  private async Airport(interaction: CommandInteraction) {
    if (!interaction.guildId) throw new Error();

    const options = {
      channel:
        interaction.options.getChannel("channel", false)?.id ?? undefined,
      arrives: interaction.options.getBoolean("arrives", false) ?? undefined,
      arriveMessage:
        interaction.options.getString("arrive-message", false) ?? undefined,
      departs: interaction.options.getBoolean("departs", false) ?? undefined,
      departMessage:
        interaction.options.getString("depart-message", false) ?? undefined,
      joinRole:
        interaction.options.getRole("join-role", false)?.id ?? undefined,
      giveJoinRole:
        interaction.options.getBoolean("give-join-role", false) ?? undefined,
      ping: interaction.options.getBoolean("ping", false) ?? undefined,
    };

    const opts = await this.container.client.prisma.airportSettings.update({
      where: {
        guildId: interaction.guildId,
      },
      data: {
        ...options,
      },
    });

    interaction.editReply({
      embeds: [
        new EvieEmbed() //
          .setTitle("Airport Settings")
          .setDescription(
            removeIndents(
              `${
                opts.arrives
                  ? `**Arrives**: ${Emojis.enabled}`
                  : `**Arrives**: ${Emojis.disabled}`
              }\n${
                opts.arriveMessage
                  ? `**Arrive Message**: ${opts.arriveMessage}`
                  : `**Arrive Message**: ${Emojis.disabled}`
              }\n${
                opts.departs
                  ? `**Departs**: ${Emojis.enabled}`
                  : `**Departs**: ${Emojis.disabled}`
              }\n${
                opts.departMessage
                  ? `**Depart Message**: ${opts.departMessage}`
                  : `**Depart Message**: ${Emojis.disabled}`
              }\n${
                opts.giveJoinRole
                  ? `**Give Join Role**: ${Emojis.enabled}`
                  : `**Give Join Role**: ${Emojis.disabled}`
              }\n${
                opts.ping
                  ? `**Ping user's arrive message**: ${Emojis.enabled}`
                  : `**Ping user's arrive message**: ${Emojis.disabled}`
              }\n${
                opts.joinRole
                  ? `**Join Role**: <@&${opts.joinRole}>`
                  : `**Join Role**: ${Emojis.disabled}`
              }\n${
                opts.channel
                  ? `**Channel**: <#${opts.channel}>`
                  : "**Channel**: ${Emojis.disabled}"
              }`
            )
          ),
      ],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        defaultPermission: false,
        options: [
          {
            name: "evie",
            description: "Modify base Evie settings for this server.",
            type: "SUB_COMMAND",
            options: configOptions.evie,
          },
          {
            name: "airport",
            description: "Modify Airport settings for this server.",
            type: "SUB_COMMAND",
            options: configOptions.airport,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        idHints: ["954566054632366101"],
      }
    );
  }
}
