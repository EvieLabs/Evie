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

import { modAction } from "#root/utils/builders/stringBuilder";
import { punishDB } from "#root/utils/database/punishments";
import type {
  BanOptions,
  Guild,
  GuildMember,
  Snowflake,
  User,
} from "discord.js";
import { LogEmbed } from "./LogEmbed";

export class EviePunish {
  public async banGuildMember(
    m: GuildMember,
    bo: BanOptions,
    expiresAt?: Date,
    banner?: GuildMember
  ) {
    await m.ban(bo).catch((err) => {
      throw new Error(`Failed to ban member: ${err}`);
    });

    await punishDB
      .addBan(m, bo.reason ?? "No reason provided.", expiresAt, banner)
      .catch((err) => {
        throw new Error(`Failed to add ban: ${err}`);
      });

    m.client.guildLogger.log(
      m.guild,
      new LogEmbed(`punishment`)
        .setColor("#eb564b")
        .setAuthor({
          name: banner
            ? `${banner.user.tag} (${banner.user.id})`
            : `${m.client.user ? m.client.user.tag : "Me"} (${
                m.client.user ? m.client.user.id : "Me"
              })`,
        })
        .setDescription(modAction(m, "Ban", bo.reason))
    );

    return true;
  }

  public async unBanGuildMember(
    id: Snowflake,
    g: Guild,
    unbanner?: GuildMember
  ) {
    const user = await g.bans.remove(id).catch((err) => {
      throw new Error(`Failed to unban member: ${err}`);
    });

    await punishDB.deleteBan(id, g).catch((err) => {
      throw new Error(`Failed to delete ban: ${err}`);
    });

    if (user)
      g.client.guildLogger.log(
        g,
        new LogEmbed(`punishment`)
          .setColor("#eb564b")
          .setAuthor({
            name: unbanner
              ? `${unbanner.user.tag} (${unbanner.user.id})`
              : `${g.client.user ? g.client.user.tag : "Me"} (${
                  g.client.user ? g.client.user.id : "Me"
                })`,
          })
          .setDescription(modAction(user, "Ban", reason))
      );

    return user;
  }
}

type EvieBanEvent = {
  member: GuildMember;
  guild: Guild;
  reason: string | undefined;
  expiresAt?: Date;
};

type EvieUnBanEvent = {
  user: User | null;
  guild: Guild;
};
