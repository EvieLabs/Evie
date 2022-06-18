import type { AstralPlayer as DBAstralPlayer } from "@prisma/client";
import { container } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { GuildMember } from "discord.js";

export class AstralPlayer {
  public id = this.raw.id;
  public balance = this.raw.balance;
  public xp = this.raw.xp;
  public level = this.calculateLevel(this.xp);

  public async addExperience(amount: number) {
    try {
      await container.client.prisma.astralPlayer.update({
        where: {
          id: this.id,
        },
        data: {
          xp: {
            increment: amount,
          },
        },
      });
    } catch (e) {
      captureException(e);
      throw e;
    }

    return void (this.xp += amount);
  }

  private calculateLevel(xp: number) {
    return Math.floor(0.1 * Math.sqrt(xp));
  }

  public constructor(public member: GuildMember, private raw: DBAstralPlayer) {}
}

export async function getAstralPlayer(
  member: GuildMember
): Promise<AstralPlayer> {
  const player = await container.client.prisma.astralPlayer.findFirst({
    where: {
      id: member.id,
    },
  });

  if (!player) throw "Player not found. (try again)";

  return new AstralPlayer(member, player);
}
