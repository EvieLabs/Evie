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

    const { guilds, users } = (
      await shard.broadcastEval((c) => c.stats.shardStats())
    ).reduce(
      (acc, cur) => {
        acc.guilds += cur.guilds;
        acc.users += cur.users;
        return acc;
      },
      { guilds: 0, users: 0 }
    );

    const growth = [`Users: ${users}`, `Servers: ${guilds}`].map(
      (line) => `${Emojis.bulletPoint} ${line}`
    );

    embed.addFields([
      {
        name: "Growth (all shards)",
        value: growth.join("\n"),
      },
    ]);

    embed.setFooter({
      text: `Shard: ${interaction.guild?.shardId ?? 0}`,
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
