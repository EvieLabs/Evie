/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Environment } from "@evie/env";
import { ReplyStatusEmbed } from "@evie/internal";
import { Args, Command } from "@sapphire/framework";
import axios from "axios";
import { Message, MessageAttachment, ModalSubmitInteraction } from "discord.js";
import lodash from "lodash";
const { toString } = lodash;

export class Eval extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "eval",
			description: "Evaluates code. (disabled in production)",
			aliases: ["e"],
			preconditions: ["OwnerOnly"],
		});
	}

	public override async messageRun(message: Message, args: Args) {
		if (Environment.getBoolean("DISABLE_EVAL", false)) {
			return message.reply("Eval is disabled in production.");
		}

		const attachment = message.attachments.first();
		try {
			const code = attachment
				? await axios.get<string>(attachment.url).then((res) => res.data)
				: await args.rest("string");
			return void this.eval(code, message);
		} catch {
			return ReplyStatusEmbed(false, "No code provided", message);
		}
	}

	private async eval(code: string, interaction: Message | ModalSubmitInteraction) {
		try {
			// @ts-expect-error 6133
			const cum = true;
			// @ts-expect-error 6133
			const message = interaction;

			// @ts-expect-error 6133
			const i = interaction;

			// @ts-expect-error 6133
			const a = axios;

			const result = await eval(code);

			const formattedResult = JSON.stringify(result, null, 4);
			const messageContent = `**Output**\n\`\`\`json\n${formattedResult}\n\`\`\``;
			await interaction.reply({
				content: messageContent.length > 2000 ? "Output too long to send, attached it" : messageContent,
				files:
					messageContent.length > 2000
						? [new MessageAttachment(Buffer.from(`${code}\n\n${formattedResult}`), "result.js")]
						: [],
			});
		} catch (e) {
			const fmtResult = `\`\`\`js\n${code}\n\n// ${toString(e)}\n\`\`\``;

			await interaction.reply({
				content: fmtResult.length > 2000 ? "Output too long to send, attached it" : fmtResult,
				files:
					fmtResult.length > 2000
						? [new MessageAttachment(Buffer.from(`${code}\n\n// ${toString(e)}`), "result.js")]
						: [],
			});
		}
	}
}
