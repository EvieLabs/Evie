/* 
Copyright 2022 Tristan Camejo

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

import { embed } from "../tools";
import { axo } from "../axologs";
import * as evie from "../tools";
import { ContextMenuInteraction, GuildMember, Role } from "discord.js";
import fetch from "node-fetch";
type discordRes = {
  discordId: string;
  error: boolean;
  discordTag: string;
  discordName: string;
  uuid: string;
  username: string;
};
module.exports = {
  data: {
    name: "Lookup User",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    if (!i.inGuild()) {
      return;
    }
    const m = i.options.getMember("user") as GuildMember;
    const e = await evie.embed(i.guild!);
    i.deferReply();
    const res: discordRes = await fetch(
      `https://api.tristansmp.com/discord/users/id/${m.id}/player`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    let joinDate;
    if (res.error == false) {
      const tres = await fetch(
        "http://202.131.88.29:25571/player/" + res.username + "/raw",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
      joinDate = new Date(tres.joinDate);
      joinDate = tres.BASE_USER.registered
        ? `<t:${Math.trunc(tres.BASE_USER.registered / 1000)}:R>`
        : "Never";
    }

    e.setTitle(
      `${m.user.tag} ${
        res.username ? `| ${res.username}` : "| No Linked Minecraft Account"
      }`
    );
    e.setImage(m.user.displayAvatarURL());
    if (res.uuid) {
      e.setThumbnail(`https://crafatar.com/renders/body/${res.uuid}`);
    }
    e.addField("User", `${m.user.tag} (${m.user.id})`, false);
    e.addField("Nickname", m.nickname || "None", false);
    e.addField(
      `Linked Minecraft Account`,
      `${res.username} | \`${res.uuid}\`` || "None",
      false
    );
    e.addField(
      `Joined TSMP Discord`,
      m.joinedAt
        ? `<t:${Math.trunc(m.joinedAt.getTime() / 1000)}:R>`
        : "Unknown",
      true
    );
    e.addField(`Joined TSMP Minecraft Server`, joinDate || "Missing", true);
    e.addField(
      `Created Discord Account`,
      m.user.createdAt
        ? `<t:${Math.trunc(m.user.createdAt.getTime() / 1000)}:R>`
        : "Unknown",
      true
    );
    e.addField(
      "Member Status",
      m.roles.cache.has("904148775801585676")
        ? "Blacklisted"
        : m.roles.cache.has("878074525223378974")
        ? "Member"
        : "Denied/Not Applied",
      true
    );

    i.editReply({ embeds: [e] });
  },
};
