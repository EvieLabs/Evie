import * as Sentry from "@sentry/node";
import type { Snowflake } from "discord-api-types";
import type { Guild } from "discord.js";
import { dbUtils } from ".";

/** Gets the goodbye module boolean for the specified guild */
async function getGoodbyeModuleSwitch(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.goodbyeMessageEnabled || false;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

/** Gets the goodbye channel for the specified guild */
async function getGoodbyeChannel(guild: Guild): Promise<Snowflake | null> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.goodbyeChannel || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Gets the goodbye message for the specified guild */
async function getGoodbyeMessage(guild: Guild): Promise<string | null> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.goodbyeMessage || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Gets the welcome module boolean for the specified guild */
async function getWelcomeModuleSwitch(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.welcomeMessageEnabled || false;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

/** Gets the welcome channel for the specified guild */
async function getWelcomeChannel(guild: Guild): Promise<Snowflake | null> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.welcomeChannel || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Gets the goodbye message for the specified guild */
async function getWelcomeMessage(guild: Guild): Promise<string | null> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.welcomeMessage || null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

/** Gets the welcome ping boolean for the specified guild */
async function getWelcomePing(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.welcomeMessagePingEnabled || false;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

export const welcomeDB = {
  getWelcomeChannel,
  getWelcomeMessage,
  getWelcomeModuleSwitch,
  getWelcomePing,
  getGoodbyeChannel,
  getGoodbyeMessage,
  getGoodbyeModuleSwitch,
};
