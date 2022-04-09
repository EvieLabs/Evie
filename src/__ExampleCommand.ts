import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { CommandInteraction, ContextMenuInteraction } from "discord.js";
import { registeredGuilds } from "./utils/parsers/envUtils";

export class Boop extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const user = interaction.options.getUser("user_to_boop", true);

    await interaction.reply({
      content: `${user} boop`,
      allowedMentions: { users: [...new Set([interaction.user.id, user.id])] },
    });
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (interaction.user.id !== "139836912335716352") {
      await interaction.reply({
        ephemeral: true,
        content: "This maze wasn't meant for you.",
      });
      return;
    }

    const user =
      interaction.targetType === "USER"
        ? interaction.options.getUser("user", true).id
        : interaction.options.getMessage("message", true).author.id;

    await interaction.reply({
      content: `<@${user}> just got booped by ${interaction.user}`,
      allowedMentions: { users: [...new Set([interaction.user.id, user])] },
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Boops the specified user",
        options: [
          {
            name: "user_to_boop",
            description: "Who shall be booped today? >:3",
            type: "USER",
          },
        ],
      },
      {
        guildIds: registeredGuilds,
      }
    );

    registry.registerContextMenuCommand(
      {
        name: "Boop user",
        type: "USER",
      },
      {
        guildIds: registeredGuilds,
      }
    );

    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Boop message author gently")
          .setType(ApplicationCommandType.Message),
      {
        guildIds: registeredGuilds,
      }
    );
  }
}
