/* 
Copyright 2022 Tristan Camejo

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

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.author.bot) return;
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    let BannedWords: Array<String> = [];
    if (await evie.getDBL(message.guild)) {
      BannedWords = [...(await evie.getBL(message.guild)), ...evie.badwords];
    } else {
      BannedWords = await evie.getBL(message.guild);
    }

    if (message.author.id !== message.guild.me.id) {
      if (
        BannedWords.some((word) =>
          message.toString().toLowerCase().includes(word.toLowerCase())
        )
      ) {
        try {
          await message.delete();
          await sleep(1500);
        } catch (error) {
          message.channel.send(
            `User ${message.author} said a banned word, but I don't have perms to delete it!`
          );
        }
      }
    }
  },
};
