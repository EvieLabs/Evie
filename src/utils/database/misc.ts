import * as Sentry from "@sentry/node";
import type { Guild, Message } from "discord.js";

/** Gets all imported messages ever made for the specified guild */
async function getImportedMessages(guild: Guild): Promise<string[]> {
  try {
    console.log("wooosh!");
    return ((await guild.client.db.FetchGuildProperty(
      guild,
      "importedMessages"
    )) ?? []) as [];
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
    return await message.client.prisma.guildSettings.update({
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
