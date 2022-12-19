import { Environment } from "#root/../../../packages/env/dist";
import { container } from "@sapphire/framework";
import type { GuildMember, User } from "discord.js";

export function checkPerm(member: GuildMember, perm: bigint): boolean {
	return member.permissions.has(perm);
}

export async function boostsEvie(user: User): Promise<boolean> {
	if (Environment.getBoolean("SKIP_EVIE_PLUS_CHECKS", false)) return true;

	try {
		const member = await (await container.client.guilds.fetch("988268415712104458")).members.fetch(user.id);
		return member.premiumSince !== null;
	} catch (e) {
		return false;
	}
}
