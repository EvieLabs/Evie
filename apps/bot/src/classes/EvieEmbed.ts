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
import { type Guild, MessageEmbed, ColorResolvable } from "discord.js";

export async function EvieEmbed(guild: Guild | null): Promise<MessageEmbed> {
  return new MessageEmbed()
    .setColor((await MiscDB.getEmbedColor(guild)) as ColorResolvable)
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://www.eviebot.rocks/assets/EvieIcon.png",
    });
}
