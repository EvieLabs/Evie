import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import * as cardinal from "cardinal";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "stacktrace",
	description: "Fetch an error's stack trace",
	preconditions: ["OwnerOnly"],
	aliases: ["error", "err", "stack", "trace"],
})
export class StackTrace extends Command {
	public override async messageRun(message: Message, args: Args) {
		const eventId = await args.pick("string").catch(() => {
			throw "You must specify an event id to fetch.";
		});

		if (!this.container.client.sentry) {
			throw "Sentry is not enabled.";
		}

		const issue = await this.container.client.sentry.resolveEventId(eventId);

		if (!issue) {
			throw "That event id is invalid.";
		}

		const frames = issue.event.entries?.find((entry) => entry.type === "exception")?.data?.values?.[0]?.stacktrace
			?.frames;

		if (!frames || frames.length === 0) {
			throw "There's no frames in that event.";
		}

		const lastFrame = frames[frames.length - 1];

		if (!lastFrame) {
			throw "um";
		}

		const context = lastFrame.context;

		if (!context || context.length === 0) {
			throw "There's no context in that frame.";
		}

		const erroredLine = lastFrame.lineNo;

		const format = (line: string) => cardinal.highlight(line);

		const sourceCode = context
			.map((line) => (line[0] === erroredLine ? `\u001b[0;40m${line[1]}\u001b[0;0m` : format(line[1])))
			.join("\n");

		console.log(sourceCode);

		return message.channel.send({
			content: ["```ansi", sourceCode, "```"].join("\n"),
		});
	}
}
