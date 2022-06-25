import PlayerStats from "#root/components/astral/PlayerStats";
import { getAstralPlayer } from "@astral/utils";
import { astralGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { CommandInteraction, ContextMenuInteraction } from "discord.js";
import React from "react";
@ApplyOptions<Command.Options>({
  description: "View a player's Astral stats",
  name: "stats",
})
export class Stats extends Command {
  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild()) return;

    await interaction.deferReply();

    const member = interaction.options.getMember("user");

    if (!member) throw "Failed to fetch member. (try again)";

    const player = await getAstralPlayer(member).catch(() => {
      throw "Failed to fetch player. (try again)";
    });

    return void interaction.client.reacord.editReply(
      interaction,
      <PlayerStats player={player} />
    );
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    const ephemeral = !interaction.options.getBoolean("show") ?? false;

    await interaction.deferReply({ ephemeral });

    const member = interaction.options.getMember("user") ?? interaction.member;

    if (!member) throw "Failed to fetch member. (try again)";

    const player = await getAstralPlayer(member).catch(() => {
      throw "Failed to fetch player. (try again)";
    });

    return void interaction.client.reacord.editReply(
      interaction,
      <PlayerStats player={player} />
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Stats")
          .setType(ApplicationCommandType.User),
      {
        guildIds: astralGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );

    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "user",
            description: "The user to view stats for (defaults to you)",
            type: "USER",
            required: false,
          },
          {
            name: "show",
            description: "Send the message non-ephemerally",
            type: "BOOLEAN",
            required: false,
          },
        ],
      },
      {
        guildIds: astralGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
