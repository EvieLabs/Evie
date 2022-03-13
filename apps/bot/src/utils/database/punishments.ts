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

import { Guild, GuildMember, Snowflake, SnowflakeUtil } from "discord.js";
import { prisma } from ".";

/** Adds a ban to the database */
async function addBan(m: GuildMember, reason: string, expiresAt?: Date) {
  try {
    return await prisma.evieTempBan.create({
      data: {
        id: SnowflakeUtil.generate(),
        userId: m.id,
        guildId: m.guild.id,
        reason: reason,
        expiresAt,
      },
    });
  } catch (error) {
    throw new Error(`Failed to add ban: ${error}`);
  }
}

/** Deletes an already existing ban on the database */
async function deleteBan(m: Snowflake, g: Guild) {
  try {
    return await prisma.evieTempBan.delete({
      where: {
        userId_guildId: {
          userId: m,
          guildId: g.id,
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to add ban: ${error}`);
  }
}

/** Gets an already existing ban on the database */
async function getBan(m: GuildMember) {
  try {
    return await prisma.evieTempBan.findFirst({
      where: {
        userId: m.id,
        guildId: m.guild.id,
      },
    });
  } catch (error) {
    throw new Error(`Failed to find ban: ${error}`);
  }
}

export const punishDB = {
  addBan,
  deleteBan,
  getBan,
};
