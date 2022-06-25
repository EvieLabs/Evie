import { Emojis } from "#root/Enums";
import { EviePlus, EvieUser as DBEvieUser, UserFlags } from "@prisma/client";
import { container } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { User } from "discord.js";

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

      return this.manipulate(evieUser);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  private static manipulate(fetchedUser: FetchedEvieUser) {
    const badges = fetchedUser.flags
      ? fetchedUser.flags.map((flag) => this.userFlagToEmoji(flag))
      : null;

    if (badges && fetchedUser.id === "97470053615673344")
      badges.unshift(Emojis.evieCreator);

    const badgesString = badges ? badges.join(" ") : null;

    return {
      badges: badgesString,
      ...fetchedUser,
    };
  }

  private static userFlagToEmoji(flag: UserFlags): string {
    switch (flag) {
      case UserFlags.CONTRIBUTOR:
        return Emojis.evieContributor;
      default:
        return Emojis.unknownBadge;
    }
  }
}
