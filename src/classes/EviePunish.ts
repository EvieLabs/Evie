import { modActionDescription } from "#root/utils/builders/stringBuilder";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { BanOptions, Guild, GuildMember, Snowflake } from "discord.js";
import { SnowflakeUtil, User } from "discord.js";
import { LogEmbed } from "./LogEmbed";
export class EviePunish {
  public async createModAction(
    guild: Guild,
    options: {
      action: string;
      target: User;
      moderator?: User;
      reason?: string;
      expiresAt?: Date;
    }
  ) {
    try {
      await container.client.prisma.modAction
        .create({
          data: {
            id: SnowflakeUtil.generate(),
            guildId: guild.id,
            targetID: options.target.id,
            moderatorID: options.moderator?.id,
            reason: options.reason ?? "No reason provided.",
            type: options.action,
            expiresAt: options.expiresAt,
          },
        })
        .then(async (savedAction) => {
          container.client.guildLogger.sendEmbedToModChannel(
            guild,
            new LogEmbed(`moderation`)
              .setColor("#eb564b")
              .setAuthor({
                name: options.moderator
                  ? `${options.moderator.tag} (${options.moderator.id})`
                  : `${
                      container.client.user ? container.client.user.tag : "Me"
                    } (${
                      container.client.user ? container.client.user.id : "Me"
                    })`,
              })
              .setDescription(
                modActionDescription({
                  ...savedAction,
                  target: options.target,
                })
              )
              .setFooter({
                text: savedAction.id,
              })
          );
        });
    } catch (e) {
      Sentry.captureException(e);
      throw new Error("Failed to create infraction in database");
    }
  }

  public async banGuildMember(
    member: GuildMember,
    banOptions: BanOptions,
    expiresAt?: Date,
    banner?: GuildMember
  ) {
    await member.ban(banOptions).catch((err) => {
      throw new Error(`Failed to ban member: ${err}`);
    });

    this.createModAction(member.guild, {
      action: "Ban",
      target: member.user,
      moderator: banner?.user,
      reason: banOptions.reason,
      expiresAt: expiresAt,
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

    if (user)
      this.createModAction(guild, {
        action: "Reverse Ban",
        target: user,
        moderator: moderator?.user || undefined,
        reason: moderator?.user ? reason : `${reason} (Unknown moderator)`,
      });

    return user;
  }
}
