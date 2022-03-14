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

import type { BanOptions, Guild, GuildMember, Snowflake } from "discord.js";
import { punishDB } from "../database/punishments";

export async function banGuildMember(
  m: GuildMember,
  bo: BanOptions,
  expiresAt?: Date
) {
  await m.ban(bo).catch((err) => {
    throw new Error(`Failed to ban member: ${err}`);
  });

  await punishDB
    .addBan(m, bo.reason ?? "No reason provided.", expiresAt)
    .catch((err) => {
      throw new Error(`Failed to add ban: ${err}`);
    });

  // TODO: Run ban hooks such as logging it to a channel
  m.client.emit("evieBan", { m, bo, expiresAt });

  return true;
}

export async function unBanGuildMember(id: Snowflake, g: Guild) {
  const u = await g.bans.remove(id).catch((err) => {
    throw new Error(`Failed to unban member: ${err}`);
  });

  await punishDB.deleteBan(id, g).catch((err) => {
    throw new Error(`Failed to delete ban: ${err}`);
  });

  // TODO: Run ban hooks such as logging it to a channel
  if (u) u.client.emit("evieBan", { u, id, g });

  return u;
}
