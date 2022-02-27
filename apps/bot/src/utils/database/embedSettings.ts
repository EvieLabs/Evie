import type { Guild } from "discord.js";
import { prisma } from ".";

/** Gets the embed color for the specified guild */
async function getEC(guild: Guild): Promise<string | null> {
  try {
    const result = await prisma.guildsettings.findFirst({
      where: {
        serverid: guild.id,
      },
    });
    return result?.color || null;
  } catch (error) {
    return null;
  }
}

async function getBL(guild: Guild) {
  try {
    const result = await prisma.guildsettings.findFirst({
      where: {
        serverid: guild.id,
      },
    });
    return result?.bannedWordList?.split(",") || [];
  } catch (error) {
    return [];
  }
}

export const MiscDB = {
  getBL,
  getEC,
};
