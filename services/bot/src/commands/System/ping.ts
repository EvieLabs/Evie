import { Command } from "@sapphire/framework";
import { blue, green, magenta } from "colorette";
import type { Message } from "discord.js";
import { removeIndents } from "#root/utils/builders/stringBuilder";

export class Ping extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "ping",
			aliases: ["pong"],
			description: "System status check.",
		});
	}

	public override async messageRun(message: Message) {
		const msg = await message.reply("**!** `e v i e` **!**");

		const content = removeIndents(`\`\`\`ansi
    ${green("Bot Latency")}: ${magenta(Math.round(this.container.client.ws.ping))}
    ${blue("API Latency")}: ${magenta(msg.createdTimestamp - message.createdTimestamp)}
    \`\`\``);

		return msg.edit(content);
	}
}
