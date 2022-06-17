import type { AstralPlayer } from "@astral/types";
import { container } from "@sapphire/framework";

export async function addExperience(
  player: AstralPlayer,
  amount: number
): Promise<AstralPlayer> {
  const newPlayer = await container.client.prisma.astralPlayer.update({
    where: {
      id: player.id,
    },
    data: {
      xp: {
        increment: amount,
      },
    },
  });

  return {
    ...newPlayer,
    level: calculateLevel(newPlayer.xp),
    member: player.member,
  };
}

export function calculateLevel(xp: number) {
  return Math.floor(0.1 * Math.sqrt(xp));
}
