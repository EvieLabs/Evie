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
import type { Guild, Message } from "discord.js";
import { dbUtils } from ".";

/** Gets all imported messages ever made for the specified guild */
async function getImportedMessages(guild: Guild): Promise<string[]> {
  try {
    const eG = await dbUtils.getGuild(guild);
    return eG?.importedMessages || [];
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
}

/** Adds a new imported message for the specified guild
 * (imported messages are messages the user has made Evie send,
 * imported messages can be edited by the user) */
async function addImportedMessage(message: Message) {
  try {
    if (!message.guild) throw new Error("Message is not in a guild.");
    return await message.client.prisma.evieGuild.update({
      where: {
        id: message.guild.id,
      },
      data: {
        importedMessages: {
          push: message.id,
        },
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(`Failed to add imported message: ${error}`);
  }
}

export const miscDB = { getImportedMessages, addImportedMessage };
