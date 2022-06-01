import { transformOauthGuildsAndUser } from "#utils/api/transformers";
import { getNumberSecret, getSecret } from "#utils/parsers/envUtils";
import type { ClientOptions } from "discord.js";

export const APIOptions: ClientOptions["api"] = {
  auth: {
    id: getSecret("DISCORD_CLIENT_ID"),
    secret: getSecret("DISCORD_SECRET"),
    cookie: getSecret("COOKIE_NAME"),
    redirect: getSecret("REDIRECT_URL"),
    scopes: ["identify", "guilds"],
    transformers: [transformOauthGuildsAndUser],
  },
  origin: getSecret("ORIGIN_URL"),
  listenOptions: {
    port: getNumberSecret("API_PORT") || 4000,
  },
};
