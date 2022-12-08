import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

const noResponse =
	"https://cdn.discordapp.com/attachments/877795126615879750/987963420580130826/speechless-shocked.gif";

export class GPT extends Command {
	private readonly openai: OpenAIApi | null = null;

	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "gpt",
			description: "Create a completion of text using GPT",
			preconditions: ["OwnerOnly"],
			aliases: ["ai"],
		});
		if (!process.env.OPENAI_API_KEY) return;
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.openai = new OpenAIApi(configuration);
	}

	public override async messageRun(message: Message, args: Args) {
		if (!this.openai) throw "OpenAI not configured.";
		const prompt = await args.rest("string").catch(() => "hi");

		console.log(prompt);

		await message.channel.sendTyping();

		const response = await this.openai.createCompletion({
			model: "text-davinci-002",
			prompt,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		if (!response.data.choices) return void (await message.reply(noResponse));

		if (!(response.data.choices.length > 0)) return void (await message.reply(noResponse));
		const choice = response.data.choices[0];
		if (!choice?.text) return void (await message.reply(noResponse));
		return void (await message.reply(choice.text));
	}
}
