import { modAction } from "#root/utils/builders/stringBuilder";
import { punishDB } from "#root/utils/database/punishments";
import type { BanOptions, Guild, GuildMember, Snowflake } from "discord.js";
import { LogEmbed } from "./LogEmbed";

export class EviePunish {
  public async banGuildMember(
    member: GuildMember,
    banOptions: BanOptions,
    expiresAt?: Date,
    banner?: GuildMember
  ) {
    await member.ban(banOptions).catch((err) => {
      throw new Error(`Failed to ban member: ${err}`);
    });

    await punishDB
      .addBan(
        member,
        banOptions.reason ?? "No reason provided.",
        expiresAt,
        banner
      )
      .catch((err) => {
        throw new Error(`Failed to add ban: ${err}`);
      });

    member.client.guildLogger.modLog(
      member.guild,
      new LogEmbed(`punishment`)
        .setColor("#eb564b")
        .setAuthor({
          name: banner
            ? `${banner.user.tag} (${banner.user.id})`
            : `${member.client.user ? member.client.user.tag : "Me"} (${
                member.client.user ? member.client.user.id : "Me"
              })`,
        })
        .setDescription(modAction(member.user, "Ban", banOptions.reason))
    );

    return true;
  }

  public async unBanGuildMember(
    id: Snowflake,
    guild: Guild,
    unBanner?: GuildMember
  ) {
    const user = await guild.bans.remove(id).catch((err) => {
      throw new Error(`Failed to unban member: ${err}`);
    });

    const data = await punishDB.deleteBan(id, guild).catch((err) => {
      throw new Error(`Failed to delete ban: ${err}`);
    });

    if (user)
      guild.client.guildLogger.modLog(
        guild,
        new LogEmbed(`punishment`)
          .setColor("#eb564b")
          .setAuthor({
            name: unBanner
              ? `${unBanner.user.tag} (${unBanner.user.id})`
              : `${guild.client.user ? guild.client.user.tag : "Me"} (${
                  guild.client.user ? guild.client.user.id : "Me"
                })`,
          })
          .setDescription(modAction(user, "Undo ban", data.reason))
      );

    return user;
  }
}
