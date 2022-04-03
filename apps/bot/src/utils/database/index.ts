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

import type { EvieGuild } from "@prisma/client";
import Sentry from "@sentry/node";
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
