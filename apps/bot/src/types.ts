/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { SlashCommandBuilder } from "@discordjs/builders";
import type {
  CommandInteraction,
  ContextMenuInteraction,
  Snowflake,
} from "discord.js";

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

export interface EvieTag {
  id: Snowflake;
  name: string;
  content: string;
  embed: boolean;
}
