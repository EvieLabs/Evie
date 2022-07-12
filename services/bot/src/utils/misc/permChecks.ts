import { container } from "@sapphire/framework";
import type { GuildMember, User } from "discord.js";

export function checkPerm(member: GuildMember, perm: bigint): boolean {
	return member.permissions.has(perm);
}

export async function boostsEvie(user: User): Promise<boolean> {
	try {
		const member = await (await container.client.guilds.fetch("819106797028769844")).members.fetch(user.id);
		return member.premiumSince !== null;
	} catch (e) {
		return false;
	}
}
