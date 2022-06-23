import { getSecret, prefixes } from "@evie/config";
import { LogLevel } from "@sapphire/framework";
import { ClientOptions, Intents, Options } from "discord.js";
import { APIOptions } from "./client/api";
import { i18nOptions } from "./client/i18n";

export const EvieClientOptions: ClientOptions = {
  presence: {
    status: "online",
    activities: [{ name: "/getstarted", type: "LISTENING" }],
  },
  api: process.env.DISABLE_API ? undefined : APIOptions,
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
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  logger: {
    level:
      getSecret("NODE_ENV", false) === "production"
        ? LogLevel.Info
        : LogLevel.Debug,
  },
  loadMessageCommandListeners: true,
  shards: "auto",
  allowedMentions: { users: [], roles: [] },
};
