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

import { MiscDB } from "#utils/database/embedSettings";
import {
  ButtonInteraction,
  ColorResolvable,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageEmbed,
  MessageMentionOptions,
  ModalSubmitInteraction,
  type Guild,
} from "discord.js";
import type { APIMessage } from "discord.js/node_modules/discord-api-types/v9";

export enum StatusEmoji {
  SUCCESS = "<a:success:952340083418230874>",
  FAIL = "<a:fail:952340157858709594>",
}

export async function EvieEmbed(guild: Guild | null): Promise<MessageEmbed> {
  return new MessageEmbed()
    .setColor((await MiscDB.getEmbedColor(guild)) as ColorResolvable)
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    });
}

export async function StatusEmbed(status: StatusEmoji, description: string) {
  return new MessageEmbed()
    .setColor(status === StatusEmoji.SUCCESS ? "#00ff00" : "#ff0000")
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    })
    .setDescription(`${status} ${description}`);
}

export async function ReplyStatusEmbed(
  status: StatusEmoji,
  description: string,
  i:
    | CommandInteraction
    | ModalSubmitInteraction
    | ContextMenuInteraction
    | ButtonInteraction,
  allowedMentions?: MessageMentionOptions
): Promise<Message | Message<boolean> | APIMessage | void> {
  const embed = new MessageEmbed()
    .setColor(status === StatusEmoji.SUCCESS ? "#00ff00" : "#ff0000")
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    })
    .setDescription(`${status} ${description}`);

  return i.replied
    ? i.followUp({
        embeds: [embed],
        ephemeral: true,
        allowedMentions: allowedMentions,
      })
    : i.reply({
        embeds: [embed],
        ephemeral: true,
        allowedMentions: allowedMentions,
      });
}
