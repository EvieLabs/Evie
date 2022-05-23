import { ModActionType, OppositeModActionType } from "#root/Enums";
import { modActionDescription } from "#root/utils/builders/stringBuilder";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import {
  BanOptions,
  Guild,
  GuildMember,
  Snowflake,
  SnowflakeUtil,
  User,
} from "discord.js";
import { LogEmbed } from "./LogEmbed";
export class EviePunish {
  public async createModAction(guild: Guild, options: ModActionOptions) {
    try {
      if (
        !(
          await container.client.prisma.moderationSettings.findFirst({
            where: {
              guildId: guild.id,
            },
          })
        )?.logChannel
      )
        return;

      await container.client.prisma.modAction
        .create({
          data: {
            id: SnowflakeUtil.generate(),
            guildId: guild.id,
            targetID: options.target.id,
            moderatorID: options.moderator?.id,
            reason: options.reason ?? "No reason provided.",
            typeId: options.type,
            type: options.action,
            expiresAt: options.expiresAt,
          },
        })
        .then(async (savedAction) => {
          const channel = await container.client.guildLogger.getModChannel(
            guild
          );

          const ogCaseAction = await this.findOriginalModAction(guild, options);

          await channel
            .send({
              embeds: [
                new LogEmbed(`moderation`)
                  .setColor("#eb564b")
                  .setAuthor({
                    name: options.moderator
                      ? `${options.moderator.tag} (${options.moderator.id})`
                      : `${
                          container.client.user
                            ? container.client.user.tag
                            : "Me"
                        } (${
                          container.client.user
                            ? container.client.user.id
                            : "Me"
                        })`,
                  })
                  .setDescription(
                    modActionDescription(
                      {
                        ...savedAction,
                        target: options.target,
                      },
                      ogCaseAction
                        ? {
                            action: ogCaseAction,
                            channel,
                          }
                        : undefined
                    )
                  )
                  .setFooter({
                    text: savedAction.id,
                  }),
              ],
            })

            .then(async (msg) => {
              if (!msg) return;
              return await container.client.prisma.modAction.update({
                where: {
                  id: savedAction.id,
                },
                data: {
                  logMessageID: msg.id,
                },
              });
            });
        });
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  private async findOriginalModAction(
    guild: Guild,
    newOptions: ModActionOptions
  ) {
    const oppositeAction = OppositeModActionType(newOptions.type);

    if (!oppositeAction) return null;

    const modAction = await container.client.prisma.modAction
      .findFirst({
        where: {
          targetID: newOptions.target.id,
          guildId: guild.id,
          typeId: oppositeAction,
        },
      })
      .catch((err) => {
        Sentry.captureException(err);
        return;
      });

    if (!modAction) return null;

    return modAction;
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
      type: ModActionType.Ban,
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
        type: ModActionType.Unban,
        target: user,
        moderator: moderator?.user || undefined,
        reason: moderator?.user ? reason : `${reason} (Unknown moderator)`,
      });

    return user;
  }
}

export type ModActionOptions = {
  action?: string;
  type: ModActionType;
  target: User;
  moderator?: User;
  reason?: string;
  expiresAt?: Date;
};
