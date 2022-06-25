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
      const evieUser = await prisma.evieUser.upsert({
        where: {
          id: user.id,
        },
        create: {
          id: user.id,
        },
        update: {},
        include: {
          eviePlus: true,
        },
      });

      return this.manipulate(evieUser, user);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  private static manipulate(fetchedUser: FetchedEvieUser, user: User) {
    const badges = [];

    user.flags && badges.push(this.userFlagsToEmoji(user.flags));

    fetchedUser.flags &&
      badges.push(
        fetchedUser.flags.map((flag) => this.evieUserFlagToEmoji(flag))
      );

    if (badges && fetchedUser.id === "97470053615673344")
      badges.unshift(Emojis.evieCreator);

    const badgesString = badges ? badges.join(" ") : null;

    return {
      badges: badgesString,
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

  private static userFlagsToEmoji(flags: UserFlags): string[] {
    return flags.toArray().map((flag) => {
      switch (flag) {
        case "VERIFIED_BOT":
          return Emojis.verifiedBot;
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
