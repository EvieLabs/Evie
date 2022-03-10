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

import type { Snowflake } from "discord-api-types";
import { dbUtils } from ".";

/** Gets the goodbye module boolean for the specified guild */
async function getGoodbyeModuleSwitch(guild: any): Promise<boolean> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.goodbyeMessageEnabled || false;
  } catch (error) {
    return false;
  }
}

/** Gets the goodbye channel for the specified guild */
async function getGoodbyeChannel(guild: any): Promise<Snowflake | null> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.goodbyeChannel || null;
  } catch (error) {
    return null;
  }
}

/** Gets the goodbye message for the specified guild */
async function getGoodbyeMessage(guild: any): Promise<string | null> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.goodbyeMessage || null;
  } catch (error) {
    return null;
  }
}

/** Gets the welcome module boolean for the specified guild */
async function getWelcomeModuleSwitch(guild: any): Promise<boolean> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.welcomeMessageEnabled || false;
  } catch (error) {
    return false;
  }
}

/** Gets the welcome channel for the specified guild */
async function getWelcomeChannel(guild: any): Promise<Snowflake | null> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.welcomeChannel || null;
  } catch (error) {
    return null;
  }
}

/** Gets the goodbye message for the specified guild */
async function getWelcomeMessage(guild: any): Promise<string | null> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.welcomeMessage || null;
  } catch (error) {
    return null;
  }
}

/** Gets the welcome ping boolean for the specified guild */
async function getWelcomePing(guild: any): Promise<boolean> {
  try {
    const result = await dbUtils.getGuildSettings(guild);
    return result?.welcomeMessagePingEnabled || false;
  } catch (error) {
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
