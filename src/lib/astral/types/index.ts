import type { AstralPlayer as PrismaAstralPlayer } from "@prisma/client";
import type { GuildMember } from "discord.js";

export type AstralPlayer = {
  member: GuildMember;
  player: PrismaAstralPlayer;
};
