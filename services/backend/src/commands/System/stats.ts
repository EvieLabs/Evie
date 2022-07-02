import { EvieEmbed } from "#root/classes/EvieEmbed";
import { Emojis } from "#root/Enums";
import { lang, registeredGuilds } from "@evie/config";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class StatsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "stats",
      description: "View an overview of my system.",
    });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const ephemeral = interaction.options.getBoolean("hide") ?? false;

    await interaction.deferReply({ ephemeral });

    const embed = new EvieEmbed();

    const { shard } = this.container.client;

    if (!shard) throw "no shard manager owo";

    const { guilds } = this.container.client.stats;

    const members = await shard.broadcastEval((c) =>
      c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    );

    const growth = [`Users: ${members}`, `Servers: ${guilds}`].map(
      (line) => `${Emojis.bulletPoint} ${line}`
    );

    embed.addFields([
      {
        name: "Growth",
        value: growth.join("\n"),
      },
    ]);

    embed.setFooter({
      text: `Shard: ${shard.client.id}`,
    });

    await interaction.editReply({ embeds: [embed] });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: lang.HIDE_COMMAND_OPTION_NAME,
            description: lang.HIDE_COMMAND_OPTION_DESCRIPTION,
            type: "BOOLEAN",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
