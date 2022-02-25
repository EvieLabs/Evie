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

import { Message } from "discord.js";
import * as evie from "../tools";
import { extractHostname } from "../utils";
const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message: Message) {
    if (message.author.bot || !message.inGuild()) return;
    if (!(await evie.getPhishingDetectionSwitch(message.member?.guild))) return;
    const links = message.content.match(URL_REGEX);
    if (!links) return;
    links.forEach(async (element) => {
      if (!(await evie.checkADomain(extractHostname(element)))) return;
      try {
        await message.delete();
      } catch (error) {
        message.channel.send(
          `${message.author} sent a known phishing link above, but I was unable to delete it due to a lack of permissions`
        );
      }
    });
  },
};
