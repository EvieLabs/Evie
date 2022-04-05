import type { Success } from "#root/types";
import type { EvieTag } from "@prisma/client";
import * as Sentry from "@sentry/node";
import type { Guild, Snowflake } from "discord.js";
import { dbUtils } from ".";

/** Gets the tags for the specified guild */
async function getTags(guild: Guild): Promise<EvieTag[]> {
  try {
    const tags = await guild.client.prisma.evieTag.findMany({
      where: {
        guildId: guild?.id,
      },
    });
    return tags || [];
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
}

/** Gets specific tag from Snowflake */
async function getTagFromSnowflake(
  guild: Guild,
  tagId: Snowflake
): Promise<EvieTag | null> {
  try {
    const tag = await guild.client.prisma.evieTag.findFirst({
      where: {
        id: tagId,
        guildId: guild?.id,
      },
    });
    return tag || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Deletes specific tag from Snowflake */
async function deleteTagFromSnowflake(
  guild: Guild,
  tagId: Snowflake
): Promise<EvieTag | null> {
  try {
    const tag = await guild.client.prisma.evieTag.delete({
      where: {
        id: tagId,
      },
    });
    return tag || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Deletes first tag from name */
async function deleteClosestTagFromName(
  guild: Guild,
  tagName: string
): Promise<EvieTag | null> {
  try {
    const tag = await guild.client.prisma.evieTag.findFirst({
      where: {
        name: tagName,
        guildId: guild.id,
      },
    });
    await guild.client.prisma.evieTag.delete({
      where: {
        id: tag?.id,
      },
    });
    return tag || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Gets first tag from name */
async function getClosestTagFromName(
  guild: Guild,
  tagName: string
): Promise<EvieTag | null> {
  try {
    const tag = await guild.client.prisma.evieTag.findFirst({
      where: {
        name: tagName,
        guildId: guild?.id,
      },
    });
    return tag || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Adds a tag to the database */
async function addTag(tag: EvieTag, guild: Guild): Promise<Success> {
  try {
    if (!tag.guildId) throw new Error("Tag must have a guildId");
    await dbUtils.getGuild(guild);
    await guild.client.prisma.evieTag.create({
      data: tag,
    });
    return {
      success: true,
      message: "Join role enabled successfully",
    };
  } catch (error) {
    Sentry.captureException(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export const tagDB = {
  getTags,
  addTag,
  getClosestTagFromName,
  getTagFromSnowflake,
};
