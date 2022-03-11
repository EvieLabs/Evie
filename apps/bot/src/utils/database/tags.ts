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

import type { Success } from "#root/types";
import type { EvieTag } from "@prisma/client";
import type { Guild } from "discord.js";
import { prisma } from ".";

/** Gets the tags for the specified guild */
async function getTags(guild: Guild): Promise<EvieTag[] | []> {
  try {
    const tags = prisma.evieTag.findMany({
      where: {
        guildId: guild?.id,
      },
    });

    return tags || [];
  } catch (error) {
    return [];
  }
}

/** Adds a tag to the database */
async function addTag(guild: Guild, tag: EvieTag): Promise<Success> {
  try {
    await prisma.guildsettings.update({
      where: {
        id: guild.id,
      },
      data: {
        tags: {
          [tag.id]: tag,
        },
      },
    });
    return {
      success: true,
      message: "Join role enabled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export const tagDB = {
  getTags,
  addTag,
};
