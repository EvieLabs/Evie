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
module.exports = {
  data: {
    name: "Revoke Player",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    if (!i.inGuild()) {
      return;
    }
    const mem: GuildMember = i.member! as GuildMember;
    if (!mem.roles.cache.has("819442569128706068")) {
      return i.reply({
        content: "You are not a staff member!",
        ephemeral: true,
      });
    }
    const m = i.options.getMember("user") as GuildMember;
    if (!m.roles.cache.has("878074525223378974")) {
      return i.reply({
        content: "You can only revoke players who have been accepted!",
        ephemeral: true,
      });
    }
    const r: Role = i.guild!.roles.cache.find(
      (r) => r.id == "878074525223378974"
    ) as Role;
    const br: Role = i.guild!.roles.cache.find(
      (r) => r.id == "904148775801585676"
    ) as Role;
    const e = await evie.embed(i.guild!);

    e.setTitle("Revoked!");
    e.setDescription(
      `Oh no! ${m} You were revoked by ${i.user}, you can appeal later by making a ticket <#884223699778150400>`
    );

    await m?.roles
      .remove(r, `Revoked by ${i.user}`)
      .then(() => {
        m?.roles.add(br, `Revoked by ${i.user}`);
        i.reply({ embeds: [e], content: `${m} Oh!` });
      })
      .catch(() => {
        i.reply({ content: "Failed! Tell Tristan asap", ephemeral: true });
      });
  },
};
