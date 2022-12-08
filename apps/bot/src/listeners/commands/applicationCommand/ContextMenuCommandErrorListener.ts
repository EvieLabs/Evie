import { EditReplyStatusEmbed, ErrorHandlers, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
	ArgumentError,
	ContextMenuCommandErrorPayload,
	Events,
	Listener,
	ListenerOptions,
	UserError,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";

@ApplyOptions<ListenerOptions>({ event: Events.ContextMenuCommandError })
export class ContextMenuCommandErrorListener extends Listener {
	public async run(error: Error, { interaction }: ContextMenuCommandErrorPayload) {
		if (error instanceof UserError || error instanceof ArgumentError) {
			return interaction.deferred
				? void EditReplyStatusEmbed(false, `${error.message}`, interaction)
				: void ReplyStatusEmbed(false, `${error.message}`, interaction);
		} else if (typeof error === "string") {
			return interaction.deferred
				? void EditReplyStatusEmbed(false, error, interaction)
				: void ReplyStatusEmbed(false, error, interaction);
		}
		captureException(error);
		return interaction.deferred
			? void EditReplyStatusEmbed(false, await ErrorHandlers.reportError(interaction, error), interaction)
			: void ReplyStatusEmbed(false, await ErrorHandlers.reportError(interaction, error), interaction);
	}
}
