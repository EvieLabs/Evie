import type { AstralPlayer } from "@astral/types";
import { container } from "@sapphire/framework";
import type { GuildMember } from "discord.js";
import { calculateLevel } from "./Levelling";

export async function getAstralPlayer(
  member: GuildMember
): Promise<AstralPlayer> {
  const player = await container.client.prisma.astralPlayer.findFirst({
    where: {
      id: member.id,
    },
  });

  if (!player) throw "Player not found. (try again)";

  return {
    ...player,
    level: calculateLevel(player.xp),
    member,
  };
}
