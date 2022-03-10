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

import type { Prisma } from "@prisma/client";
import type { Redis } from "ioredis";

interface CacheMiddlewareOptions {
  keys?: string[];
  defaultValues?: Record<string, unknown>;
  ttlInSeconds: number;
  redis: Redis;
}

/* Redis Cache Middleware for Prisma **/
export const cacheMiddleware =
  ({
    keys,
    defaultValues,
    ttlInSeconds,
    redis,
  }: CacheMiddlewareOptions): Prisma.Middleware =>
  async (params, next) => {
    if (keys) {
      const selectedKeys = Object.keys(params.args.select);
      const match = selectedKeys.every((key) => keys.includes(key));

      if (!match) {
        return next(params);
      }
    }

    let result;
    const key = `${params.model}:${params.action}:${JSON.stringify(
      params.args
    )}`;

    await redis.del(key);
    result = await redis.hgetall(key);

    if (!Object.keys(result).length) {
      try {
        result = await next(params);
      } catch (err: any) {
        if (err.name !== "NotFoundError") {
          throw err;
        }

        if (!defaultValues) {
          throw new Error(
            `${err.message}. Either handle the case of undefined by removing \`rejectOnNotFound\` or pass in \`defaultValues\`.`
          );
        }

        result = defaultValues;
      }

      await redis.hmset(key, result);

      if (ttlInSeconds) {
        redis.expire(key, ttlInSeconds);
      }
    }

    return result;
  };
