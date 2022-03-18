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

import { dbUtils } from "#root/utils/database/index";
import type { Message } from "discord.js";
import { LogEmbed } from "./LogEmbed";

export class BlockedWords {
  public async scan(message: Message) {
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    try {
      const gConfig = await dbUtils.getGuild(message.guild);
      if (!gConfig) return;

      const blockedWords = gConfig.bannedWordList;
      if (!blockedWords) return;

      for (const word of blockedWords) {
        if (message.content.toLowerCase().includes(word)) {
          if (!message.deletable) return await this.log(message, false, word);
          await message.delete();
          return await this.log(message, true, word);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async log(
    message: Message,
    successfullyDeleted: boolean,
    bannedWord: string
  ) {
    if (!message.guild) return;
    const embed = new LogEmbed(`blocked words`)
      .setColor("#4e73df")
      .setAuthor({
        name: `${message.author.tag} (${message.author.id})`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `${
          successfullyDeleted ? "Deleted" : "Failed to delete"
        } a message with a banned word`
      )
      .addField(
        "Message",
        `${message.content} ${
          successfullyDeleted
            ? `[Jump to message](${message.url})`
            : `[Jump to context](${message.url})`
        }`
      )
      .addField("Triggered Word", bannedWord);

    await message.client.guildLogger.log(message.guild, embed);
  }
}
