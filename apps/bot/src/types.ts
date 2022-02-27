import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";

export type EvieCommand = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute(interaction: CommandInteraction): Promise<void> | void;
};

export type EvieContextMenu = {
  data: {
    name: string;
    type: 1 | 2;
  };
  execute(interaction: ContextMenuInteraction): Promise<void> | void;
};

export type Success = {
  success: boolean;
  message: string | null;
};
