import type { Command } from "disploy";
import { TreeSymbols } from "../lib/emojis";
import { TailClient } from "../lib/trpcClient";

export default {
	name: "ping",
	description: "healthcheck? 123, testing?",

	async run(interaction) {
		await interaction.deferReply();
		const tail = TailClient(interaction);

		const now = Date.now();

		try {
			const health = await tail.health.query();

			let serviceTree = "";

			for (const service of health.services) {
				switch (service.type) {
					case "misc":
						serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Branch}**${service.name}**\n`;
						break;
					case "bot":
						serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Branch}**${service.name}** (shard ${service.shard})\n`;
						break;
				}

				serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.LastBranch}**Internal Ping:** ${service.internalPing}ms\n`;

				switch (service.type) {
					case "bot": {
						serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.LastBranch}**Discord Ping:** ${service.discordPing}ms\n`;
						serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.LastBranch}**Guilds:** ${service.guilds}\n`;
						serviceTree += `${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.Indent}${TreeSymbols.LastBranch}**Members:** ${service.members}\n`;
						break;
					}
				}
			}

			return void interaction.editReply({
				embeds: [
					{
						title: "Evie Network Status",
						description: `✨ Tail Latency: \`${Date.now() - now}ms\``,
						fields: [
							{
								name: "Services",
								value: serviceTree,
							},
						],
					},
				],
			});
		} catch {
			return void interaction.editReply({
				content: `error (${Date.now() - now}ms)`,
			});
		}
	},
} satisfies Command;
