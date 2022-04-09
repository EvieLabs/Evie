import type { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, ContextMenuInteraction } from "discord.js";

export interface EvieCommand {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute(interaction: CommandInteraction): Promise<void> | void;
}

export interface EvieContextMenu {
  data: {
    name: string;
    type: 1 | 2;
  };
  execute(interaction: ContextMenuInteraction): Promise<void> | void;
}

export interface Success {
  success: boolean;
  message: string | null;
}
