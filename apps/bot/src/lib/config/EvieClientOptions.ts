import { getSecret, prefixes } from "@evie/config";
import { LogLevel } from "@sapphire/framework";
import { ClientOptions, Intents, Options } from "discord.js";
import { i18nOptions } from "./client/i18n";

export const EvieClientOptions: ClientOptions = {
	presence: {
		status: "online",
		activities: [{ name: "/getstarted", type: "LISTENING" }],
	},
	i18n: i18nOptions,
	defaultPrefix: prefixes,
	caseInsensitivePrefixes: true,
	caseInsensitiveCommands: true,
	makeCache: Options.cacheEverything(),
	sweepers: {
		...Options.defaultSweeperSettings,
		messages: {
			interval: 190,
			lifetime: 900,
		},
	},
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES],
	logger: {
		level: getSecret("LOG_LEVEL", false) === "production" ? LogLevel.Info : LogLevel.Debug,
	},
	loadMessageCommandListeners: true,
	allowedMentions: { users: [], roles: [] },
};
