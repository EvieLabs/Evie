import { modAction } from "#root/utils/builders/stringBuilder";
import { punishDB } from "#root/utils/database/punishments";
import type { BanOptions, Guild, GuildMember, Snowflake } from "discord.js";
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

    m.client.guildLogger.modLog(
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
        .setDescription(modAction(m.user, "Ban", bo.reason))
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

    const data = await punishDB.deleteBan(id, g).catch((err) => {
      throw new Error(`Failed to delete ban: ${err}`);
    });

    if (user)
      g.client.guildLogger.modLog(
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
          .setDescription(modAction(user, "Undo ban", data.reason))
      );

    return user;
  }
}
