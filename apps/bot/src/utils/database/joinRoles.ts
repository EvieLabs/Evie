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
import type { Guild, Role, Snowflake } from "discord.js";
import { dbUtils } from ".";
import type { Success } from "../../types";

async function isJoinRoleOn(guild: Guild): Promise<boolean> {
  try {
    const result = await dbUtils.getGuild(guild);

    return result?.joinRoleEnabled || false;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

async function getJoinRole(guild: Guild): Promise<Snowflake | null> {
  try {
    const result = await dbUtils.getGuild(guild);

    return result?.joinRoleID || null;
  } catch (error) {
    Sentry.captureException(error);
    return false || null;
  }
}

async function setJoinRole(guild: Guild, role: Role): Promise<boolean> {
  try {
    await guild.client.prisma.evieGuild.update({
      where: {
        id: guild.id,
      },
      data: {
        joinRoleID: role.id,
      },
    });
    return true;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

async function setJoinRoleEnable(
  guild: Guild,
  enable: boolean
): Promise<Success> {
  try {
    await guild.client.prisma.evieGuild.update({
      where: {
        id: guild.id,
      },
      data: {
        joinRoleEnabled: enable,
      },
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

export const RolesDB = {
  isJoinRoleOn,
  getJoinRole,
  setJoinRole,
  setJoinRoleEnable,
};
