import type { EvieGuild } from "@prisma/client";
import * as Sentry from "@sentry/node";
import type { Guild } from "discord.js";

async function getGuild(guild: Guild): Promise<EvieGuild | null> {
  try {
    const data = await guild.client.prisma.evieGuild.findFirst({
      where: {
        id: guild.id,
      },
    });

    return data || (await createGuild(guild));
  } catch (error) {
    Sentry.captureException(error);
    console.log(error);
    return null;
  }
}

async function createGuild(guild: Guild): Promise<EvieGuild> {
  try {
    return await guild.client.prisma.evieGuild.create({
      data: {
        id: typeof guild === "string" ? guild : guild.id,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(
      `Failed to create guild for ${
        typeof guild === "string" ? guild : guild.id
      }`
    );
  }
}

export const dbUtils = { getGuild, createGuild };
