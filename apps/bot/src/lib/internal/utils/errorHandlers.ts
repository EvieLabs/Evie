import { resolveKey } from "@sapphire/plugin-i18next";
import { captureException } from "@sentry/node";
import type { BaseCommandInteraction, Message, MessageComponentInteraction } from "discord.js";

async function reportError(
	ctx: BaseCommandInteraction | Message | MessageComponentInteraction,
	error: Error,
): Promise<string> {
	const eventId = captureException(error);

	return resolveKey(ctx, "errors:commandError", { eventId });
}

export const ErrorHandlers = {
	reportError,
};
