import { container } from "@sapphire/framework";
import type { Snowflake } from "discord.js";

export async function getAstralGuildConfig(guildId: Snowflake) {
	try {
		const config = await container.client.prisma.astralConfig.findFirst({
			where: {
				guildId: guildId,
			},
		});
		return config;
	} catch (e) {
		return null;
	}
}
