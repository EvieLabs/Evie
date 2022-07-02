import { Emojis } from "#root/Enums";
import {
  EviePlus,
  EvieUser as DBEvieUser,
  UserFlags as EvieUserFlags,
} from "@prisma/client";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { User, UserFlags } from "discord.js";

type FetchedEvieUser = DBEvieUser & {
  eviePlus: EviePlus[];
};

export class EvieUser {
  public static async fetch(user: User) {
    const { prisma } = container.client;
    try {
      const evieUser = await prisma.evieUser.findFirst({
        where: {
          id: user.id,
        },
        include: {
          eviePlus: true,
        },
      });

      if (!evieUser) return null;

      return await this.manipulate(evieUser, user);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  public static async getBadges(
    user: User,
    fetchedUser?: FetchedEvieUser
  ): Promise<string> {
    const badges: string[] = [];

    if (user.flags) badges.push(...this.userFlagsToEmojis(user.flags));

    const evieUser = fetchedUser ?? (await this.fetch(user).catch(() => null));

    if (!evieUser) return badges.join(" ");

    if (evieUser.flags)
      badges.push(
        ...evieUser.flags.map((flag) => this.evieUserFlagToEmoji(flag))
      );

    if (evieUser.id === "97470053615673344") badges.unshift(Emojis.evieCreator);

    return badges.join(" ");
  }

  private static async manipulate(fetchedUser: FetchedEvieUser, user: User) {
    return {
      badges: await this.getBadges(user, fetchedUser),
      ...fetchedUser,
    };
  }

  private static evieUserFlagToEmoji(flag: EvieUserFlags): string {
    switch (flag) {
      case EvieUserFlags.CONTRIBUTOR:
        return Emojis.evieContributor;
      default:
        return Emojis.unknownBadge;
    }
  }

  private static userFlagsToEmojis(flags: UserFlags): string[] {
    return flags.toArray().map((flag) => {
      switch (flag) {
        case "VERIFIED_BOT":
          return Emojis.verified;
        case "DISCORD_CERTIFIED_MODERATOR":
          return Emojis.certifiedModerator;
        case "DISCORD_EMPLOYEE":
          return Emojis.discordStaff;
        case "PARTNERED_SERVER_OWNER":
          return Emojis.partner;
        case "HOUSE_BALANCE":
          return Emojis.houseBalance;
        case "HOUSE_BRAVERY":
          return Emojis.houseBravery;
        case "HOUSE_BRILLIANCE":
          return Emojis.houseBrilliance;
        case "EARLY_VERIFIED_BOT_DEVELOPER":
          return Emojis.earlyVerifiedBotDeveloper;
        case "EARLY_SUPPORTER":
          return Emojis.earlySupporter;
        case "BUGHUNTER_LEVEL_1":
          return Emojis.bugHunterLevel1;
        case "BUGHUNTER_LEVEL_2":
          return Emojis.bugHunterLevel2;
        default:
          return "";
      }
    });
  }
}
