import type { Command } from "disploy";
import { TailClient } from "../lib/trpcClient";

export default {
	name: "ping",
	description: "healthcheck? 123, testing?",

	async run(interaction) {
		await interaction.deferReply();
		const tail = TailClient(interaction);

		const now = Date.now();

		try {
			await tail.health.query();

			return void interaction.editReply({
				content: `ok (${Date.now() - now}ms)`,
			});
		} catch {
			return void interaction.editReply({
				content: `error (${Date.now() - now}ms)`,
			});
		}
	},
} satisfies Command;
