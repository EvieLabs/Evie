import { ErrorHandlers, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
	ArgumentError,
	Events,
	Listener,
	ListenerOptions,
	MessageCommandErrorPayload,
	UserError,
} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({ event: Events.MessageCommandError })
export class MessageCommandErrorListener extends Listener {
	public async run(error: Error, { message }: MessageCommandErrorPayload) {
		if (error instanceof UserError || error instanceof ArgumentError) {
			return void ReplyStatusEmbed(false, `${error.message}`, message);
		} else if (typeof error === "string") {
			return void ReplyStatusEmbed(false, error, message);
		}
		return void ReplyStatusEmbed(false, await ErrorHandlers.reportError(message, error), message);
	}
}
