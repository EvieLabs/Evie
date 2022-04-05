import type { GuildMember } from "discord.js";

export async function checkPerm(m: GuildMember, perm: bigint) {
  return m.permissions.has(perm);
}
