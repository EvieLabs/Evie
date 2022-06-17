import type { AstralPlayer as PrismaAstralPlayer } from "@prisma/client";
import type { GuildMember } from "discord.js";

type ExtendedPrismaAstralPlayer = PrismaAstralPlayer & {
  level: number;
};

export type AstralPlayer = ExtendedPrismaAstralPlayer & {
  member: GuildMember;
};
