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
import * as admin from "firebase-admin";

import { ContextMenuInteraction, GuildMember, Message, Role } from "discord.js";
module.exports = {
  data: {
    name: "Upload Image",
    type: 3,
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
    if (i.channelId !== "910411610592538685") {
      return i.reply({
        content: "You can only use this feature in <#910411610592538685>!",
        ephemeral: true,
      });
    }
    const message = i.options.getMessage("message") as Message;
    if (!message.content) {
      return i.reply({
        content: "The image needs to have a caption!",
        ephemeral: true,
      });
    }
    const data = {
      author: message.author.id,
      caption: message.content ?? "No Caption",
      imageURL: message.attachments.first()?.url,
    };

    const fstore = admin.firestore();

    const doc = await fstore.collection("photos").add(data);

    const e = await evie.embed(i.guild!);
    e.setTitle("Uploaded!");
    e.setDescription(`Post ID: ${doc.id}`);
    i.reply({
      embeds: [e],
      content: `${message.author}, your photo has been uploaded to https://tristansmp.com/photos by ${mem}`,
    });
  },
};
