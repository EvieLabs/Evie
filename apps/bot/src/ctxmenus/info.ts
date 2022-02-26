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
import * as evie from "../tools";
import { axo } from "../axologs";
import { ContextMenuInteraction, GuildMember, MessageButton } from "discord.js";

module.exports = {
  data: {
    name: "User Info",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    if (!i.inGuild()) {
      return;
    }
    const m = i.options.getMember("user") as GuildMember;
    const e = await evie.embed(i.guild!);
    e.setTitle(`Member Info for ${m.user.tag}`);
    e.setThumbnail(m.user.displayAvatarURL());
    e.addField("User", `${m.user.tag} (${m.user.id})`);
    e.addField("Nickname", m.nickname || "None");
    e.addField(
      `Joined ${m.guild.name}`,
      m.joinedAt ? m.joinedAt.toLocaleString() : "Unknown"
    );
    e.addField(
      `Created Account`,
      m.user.createdAt ? m.user.createdAt.toLocaleString() : "Unknown"
    );
    e.addField("Bot", m.user.bot ? "Yes" : "No");
    e.addField("Roles", m.roles.cache.map((r) => r).join(", "));
    e.addField(
      "Permissions",
      capitalizeEachWord(
        m.permissions.toArray().join(", ").replace(/\_/g, " ").toLowerCase()
      )
    );
    i.reply({ embeds: [e] });
  },
};

function capitalizeEachWord(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
