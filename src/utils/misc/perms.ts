import type { CommandInteraction, ContextMenuInteraction } from "discord.js";

export enum PermissionLang {
  MANAGE_SERVER = "Hey, you must have the `Manage Server` permission to use this command.",
  MANAGE_MESSAGES = "Hey, you must have the `Manage Messages` permission to use this command.",
}

export async function informNeedsPerms(
  interaction: CommandInteraction | ContextMenuInteraction,
  perm: PermissionLang
) {
  if (interaction.replied) {
    await interaction.editReply({
      content: perm,
      embeds: [],
      components: [],
    });
    return;
  } else {
    interaction.reply({
      content: perm,
      ephemeral: true,
    });
    return;
  }
}
