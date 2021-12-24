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
    const res: discordRes = await fetch(
      `https://api.tristansmp.com/discord/users/id/${m.id}/player`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    let joinDate;
    if (res.username) {
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
    e.addField("User", `${m.user.tag} (${m.user.id})`, true);
    e.addField("Nickname", m.nickname || "None", true);
    e.addField(
      `Linked Minecraft Account`,
      `${res.username} | \`${res.uuid}\`` || "None",
      true
    );
    e.addField(
      `Joined TSMP Discord`,
      m.joinedAt ? m.joinedAt.toLocaleString() : "Unknown",
      true
    );
    e.addField(`Joined TSMP Minecraft Server`, joinDate || "Missing", true);
    e.addField(
      `Created Account`,
      m.user.createdAt ? m.user.createdAt.toLocaleString() : "Unknown",
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

    i.reply({ embeds: [e] });
  },
};
