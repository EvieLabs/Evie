export const registeredGuilds = process.env.GUILD_IDS
  ? process.env.GUILD_IDS.split(",")
  : [];

export const botAdmins = process.env.BOT_ADMINS
  ? process.env.BOT_ADMINS.split(",")
  : [];

export const adminGuilds = process.env.ADMIN_GUILD_IDS
  ? process.env.ADMIN_GUILD_IDS.split(",")
  : ["0"];

export const astralGuilds = process.env.ASTRAL_GUILD_IDS
  ? process.env.ASTRAL_GUILD_IDS.split(",")
  : ["0"];

export const prefixes = process.env.CMD_PREFIXES
  ? process.env.CMD_PREFIXES.split(",")
  : ["dev!"];

export const googleAssistantCredentials = process.env.GOOGLE_ASSISTANT_CREDS
  ? (JSON.parse(
      process.env.GOOGLE_ASSISTANT_CREDS
    ) as GoogleAssistantCredentials)
  : null;

export interface GoogleAssistantCredentials {
  refresh_token: string;
  token_uri: string;
  client_id: string;
  client_secret: string;
  scopes: string[];
}

export function getSecret(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value)
    throw new Error(
      `Missing ${key}, make sure to set it as an environment variable!`
    );
  return process.env[key] || "";
}

export function getNumberSecret(key: string) {
  const value = process.env[key];
  return value ? parseInt(value) ?? null : null;
}
