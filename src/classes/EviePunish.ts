import { punishDB } from "#root/utils/database/punishments";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { BanOptions, Guild, GuildMember, Snowflake } from "discord.js";
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

    member.guild.client.guildLogger.modAction(member.guild, {
      action: "Ban",
      target: member.user,
      moderator: banner?.user,
      reason: banOptions.reason,
    });

    return true;
  }

  public async unBanGuildMember(
    id: Snowflake,
    guild: Guild,
    reason: string,
    moderator?: GuildMember
  ) {
    const user = await guild.bans.remove(id).catch((err) => {
      throw new Error(`Failed to reverse ban: ${err}`);
    });

    await punishDB.deleteBan(id, guild).catch((err) => {
      Sentry.captureMessage(`Failed to delete ban from database: ${err}`);
    });

    if (user)
      container.client.guildLogger.modAction(guild, {
        action: "Reverse Ban",
        target: user,
        moderator: moderator?.user || undefined,
        reason: moderator?.user ? reason : `${reason} (Unknown moderator)`,
      });

    return user;
  }
}
