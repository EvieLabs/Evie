import { container } from "@sapphire/framework";
import type { GuildMember, User } from "discord.js";

export async function checkPerm(
  member: GuildMember,
  perm: bigint
): Promise<boolean> {
  return member.permissions.has(perm);
}

export async function boostsEvie(user: User): Promise<boolean> {
  const member = await container.client.guilds
    .resolve("819106797028769844")
    ?.members.fetch(user.id);
  if (!member) return false;
  return !!member.premiumSince;
}
