import * as Sentry from "@sentry/node";
import type { Guild } from "discord.js";
import { dbUtils } from ".";

/** Gets the embed color for the specified guild */
async function getEmbedColor(guild: Guild | null): Promise<string> {
  if (!guild) return "#f47fff";
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.color || "#f47fff";
  } catch (error) {
    Sentry.captureException(error);
    return "#f47fff";
  }
}

export const MiscDB = {
  getEmbedColor,
};
