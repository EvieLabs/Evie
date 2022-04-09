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
