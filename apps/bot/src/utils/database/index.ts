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
import type { Guild } from "discord.js";
import { cacheMiddleware } from "./cacheMiddleware";
import Redis from "ioredis";
import axios, { AxiosRequestConfig } from "axios";
import { AxiosRedis } from "@tictactrip/axios-redis";

export const prisma = new PrismaClient();

if (process.env.NODE_ENV === "compose") {
  console.log("Using Redis as a caching layer");

  const prismaRedis = new Redis({
    port: 8287,
    host: "redis",
    password: "redis",
    db: 1,
  });

  prisma.$use(
    cacheMiddleware({
      redis: prismaRedis,
      defaultValues: { language: "nl", prefix: "!a" },
      ttlInSeconds: 10,
    })
  );
} else {
  console.log("Redis was not found, using no caching layer");
}

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
