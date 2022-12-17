import { ApplicationCommandOptionType, MessageFlags } from "discord-api-types/v10";
import type { Command } from "disploy";
import { RecordSchema } from "../lib/schemas";
import { TailClient } from "../lib/trpcClient";

export default {
	name: "create",
	description: "create a webhook",
	options: [
		{
			name: "tag",
			description: "tag for the webhook",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "metadata",
			description: "json metadata for the webhook",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],

	async run(interaction) {
		const tag = interaction.options.getString("tag");
		const metadata = interaction.options.getString("metadata", true);

		let metadataParsed = {};

		if (metadata) {
			try {
				metadataParsed = RecordSchema.parse(JSON.parse(metadata));
			} catch (error) {
				return void interaction.reply({
					content: "Invalid metadata",
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		await interaction.deferReply({
			ephemeral: true,
		});

		const tail = TailClient(interaction);

		const webhook = await tail.webhooks.create.mutate({
			metadata: metadataParsed,
			tag,
		});

		return void interaction.editReply({
			embeds: [
				{
					title: "Webhook created",
					description: `🔗 ${webhook.url}`,
				},
			],
		});
	},
} satisfies Command;
