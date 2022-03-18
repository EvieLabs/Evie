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

import { punishDB } from "#root/utils/database/punishments";
import type {
  BanOptions,
  Guild,
  GuildMember,
  Snowflake,
  User,
} from "discord.js";
import { EventDispatcher } from "strongly-typed-events";

export class EviePunish {
  private _onBannedMember = new EventDispatcher<EviePunish, EvieBanEvent>();
  private _onUnBannedMember = new EventDispatcher<EviePunish, EvieUnBanEvent>();

  public get onBan() {
    return this._onBannedMember.asEvent();
  }

  public get onUnBan() {
    return this._onUnBannedMember.asEvent();
  }

  public async banGuildMember(
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

    this._onBannedMember.dispatch(this, {
      member: m,
      guild: m.guild,
      reason: bo.reason,
      expiresAt,
    });

    return true;
  }

  public async unBanGuildMember(id: Snowflake, g: Guild) {
    const u = await g.bans.remove(id).catch((err) => {
      throw new Error(`Failed to unban member: ${err}`);
    });

    await punishDB.deleteBan(id, g).catch((err) => {
      throw new Error(`Failed to delete ban: ${err}`);
    });

    this._onUnBannedMember.dispatch(this, {
      guild: g,
      user: u,
    });

    return u;
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
