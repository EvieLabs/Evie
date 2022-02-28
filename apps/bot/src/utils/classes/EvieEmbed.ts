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

import { Guild, MessageEmbed } from "discord.js";
import { MiscDB } from "../database/embedSettings";
import { ColorUtils } from "../parsers/colorUtils";

export async function EvieEmbed(guild: Guild | null): Promise<MessageEmbed> {
  const color = guild
    ? ColorUtils.hexStringToHexNumber(
        (await MiscDB.getEmbedColor(guild)) ?? "#f47fff"
      )
    : ColorUtils.hexStringToHexNumber("#f47fff");
  return new MessageEmbed().setColor(color).setTimestamp().setFooter({
    text: "Evie",
    iconURL: "https://www.eviebot.rocks/assets/EvieIcon.png",
  });
}
