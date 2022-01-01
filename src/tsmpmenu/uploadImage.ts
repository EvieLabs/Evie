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
    const message = i.options.getMessage("message") as Message;
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
    i.reply({ embeds: [e] });
  },
};
