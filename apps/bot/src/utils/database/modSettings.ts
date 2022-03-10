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

import type { Guild } from "discord.js";
import { dbUtils } from ".";

/** Gets the ban words list for the specified guild */
async function getBannedWords(guild: Guild): Promise<string[] | []> {
  try {
    const result = await dbUtils.getGuildSettings(guild);

    return result?.bannedWordList?.split(",") || [];
  } catch (error) {
    return [];
  }
}

/** Gets the phishing detection boolean for the specified guild */
async function getPhishingDetectionSwitch(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuildSettings(guild);

    return result?.phishingDetectionEnabled || false;
  } catch (error) {
    return false;
  }
}

export const modDB = {
  getBannedWords,
  getPhishingDetectionSwitch,
};
