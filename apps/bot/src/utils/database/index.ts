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

import { guildsettings, PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import type { Guild } from "discord.js";
import { cacheMiddleware } from "./cacheMiddleware";

export const redis = new Redis({
  port: 8287,
  host: "redis",
  password: "redis",
  db: 1,
});

export const prisma = new PrismaClient();

async function getGuildSettings(guild: Guild): Promise<guildsettings | null> {
  try {
    const data = await prisma.guildsettings.findFirst({
      where: {
        serverid: guild.id,
      },
    });

    return data;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export const dbUtils = { getGuildSettings };
