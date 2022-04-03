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
import { Guild, GuildMember, Snowflake, SnowflakeUtil } from "discord.js";

/** Adds a ban to the database */
async function addBan(
  m: GuildMember,
  reason: string,
  expiresAt?: Date,
  banner?: GuildMember
) {
  try {
    return await m.client.prisma.evieTempBan.create({
      data: {
        id: SnowflakeUtil.generate(),
        userId: m.id,
        guildId: m.guild.id,
        reason: reason,
        expiresAt,
        bannedBy: banner ? banner.id : null,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to add ban: ${error}`);
  }
}

/** Deletes an already existing ban on the database */
async function deleteBan(m: Snowflake, g: Guild) {
  try {
    return await g.client.prisma.evieTempBan.delete({
      where: {
        userId_guildId: {
          userId: m,
          guildId: g.id,
        },
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to add ban: ${error}`);
  }
}

/** Gets an already existing ban on the database */
async function getBan(m: GuildMember) {
  try {
    return await m.client.prisma.evieTempBan.findFirst({
      where: {
        userId: m.id,
        guildId: m.guild.id,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to find ban: ${error}`);
  }
}

/** Gets all the notes for a guild member */
async function getNotes(m: GuildMember) {
  try {
    return await m.client.prisma.evieNote.findMany({
      where: {
        userId: m.id,
        guildId: m.guild.id,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to find notes: ${error}`);
  }
}

/** Adds a note to the database */
async function addNote(m: GuildMember, note: string) {
  try {
    return await m.client.prisma.evieNote.create({
      data: {
        id: SnowflakeUtil.generate(),
        userId: m.id,
        guildId: m.guild.id,
        content: note,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to add note: ${error}`);
  }
}

/** Deletes an already existing note on the database */
async function deleteNote(m: GuildMember, g: Guild) {
  try {
    return await m.client.prisma.evieNote.delete({
      where: {
        userId_guildId: {
          userId: m.id,
          guildId: g.id,
        },
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to delete note: ${error}`);
  }
}

export const punishDB = {
  addBan,
  deleteBan,
  getBan,
  getNotes,
  addNote,
  deleteNote,
};
