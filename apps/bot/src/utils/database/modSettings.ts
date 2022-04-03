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

import * as Sentry from "@sentry/node";
import type { Guild, GuildMember, Snowflake, TextChannel } from "discord.js";
import { dbUtils } from ".";

/** Gets the ban words list for the specified guild */
async function getBannedWords(guild: Guild): Promise<string[] | []> {
  try {
    const result = await dbUtils.getGuild(guild);

    return result?.bannedWordList || [];
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
}

/** Checks if the member has the staff role */
async function hasModRole(member: GuildMember): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(member.guild);

    if (!result) return false;
    if (!result?.staffRoleID) return false;

    return member.roles.cache.has(result?.staffRoleID);
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

/** Sets the staff role id for the specified guild */
async function setStaffRole(guild: Guild, roleId: Snowflake) {
  try {
    return await guild.client.prisma.evieGuild.update({
      where: {
        id: guild.id,
      },
      data: {
        staffRoleID: roleId,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to set staff role: ${error}`);
  }
}

/** Sets the log channel id for the specified guild */
async function setLogChannel(guild: Guild, channel: TextChannel) {
  try {
    return await guild.client.prisma.evieGuild.update({
      where: {
        id: guild.id,
      },
      data: {
        logChannelID: channel.id,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to set log channel id: ${error}`);
  }
}

/** Gets the phishing detection boolean for the specified guild */
async function getPhishingDetectionSwitch(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(guild);

    return result?.phishingDetectionEnabled || false;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

export const modDB = {
  getBannedWords,
  getPhishingDetectionSwitch,
  setStaffRole,
  hasModRole,
  setLogChannel,
};
