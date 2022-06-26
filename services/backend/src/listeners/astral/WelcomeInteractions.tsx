import RoleMenu, { SelectRole } from "#root/components/astral/RoleMenu";
import { getAstralGuildConfig } from "@astral/utils";
import type { AstralConfig } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { APIEmbed } from "discord-api-types/v9";
import type { ButtonInteraction, Interaction } from "discord.js";
import React from "react";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.InteractionCreate,
})
export class WelcomeInteractions extends Listener {
  private async handle(interaction: ButtonInteraction, config: AstralConfig) {
    if (!interaction.member || !interaction.inCachedGuild()) {
      return void interaction.reply({
        ephemeral: true,
        content:
          "ummm... I can't seem to find you... Try again or dm <@97470053615673344>",
      });
    }

    switch (interaction.customId) {
      case "ASTRALCRAFT_VIEW_RULES": {
        return void interaction.reply({
          ephemeral: true,
          embeds: [config.rules as APIEmbed],
        });
      }
      case "ASTRALCRAFT_ROLE_MENU": {
        return void this.container.client.reacord.ephemeralReply(
          interaction,
          <RoleMenu
            member={interaction.member}
            roles={config.roles as SelectRole[]}
          />
        );
      }
      default: {
        return;
      }
    }
  }

  public async run(interaction: Interaction) {
    if (!interaction.isButton() || !interaction.guildId) return;

    const config = await getAstralGuildConfig(interaction.guildId);

    if (!config) return;

    return void this.handle(interaction, config);
  }
}
