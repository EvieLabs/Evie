import { Environment } from "@teamevie/env";
import { z } from "zod";

export const registeredGuilds = Environment.getArray("GUILD_IDS", true) || [];
export const botAdmins = Environment.getArray("BOT_ADMINS", true) || [];
export const adminGuilds = Environment.getArray("ADMIN_GUILD_IDS", true) || ["0"];
export const astralGuilds = Environment.getArray("ASTRAL_GUILD_IDS", true) || ["0"];
export const prefixes = Environment.getArray("CMD_PREFIXES", true) || ["dev!"];
export const production = Environment.getString("NODE_ENV", true) === "production";

const GoogleAssistantCredentialsSchema = z.object({
	refresh_token: z.string(),
	token_uri: z.string(),
	client_id: z.string(),
	client_secret: z.string(),
	scopes: z.array(z.string()),
});

export const googleAssistantCredentials =
	Environment.getJson<typeof GoogleAssistantCredentialsSchema>(
		"GOOGLE_ASSISTANT_CREDS",
		GoogleAssistantCredentialsSchema,
		true,
	) || null;
