export const registeredGuilds = process.env.GUILD_IDS
  ? process.env.GUILD_IDS.split(",")
  : [];

export const TSMPGuildIDs = process.env.GUILD_IDS
  ? process.env.GUILD_IDS.split(",")
  : ["952064632187658261"];

export const botAdmins = process.env.BOT_ADMINS
  ? process.env.BOT_ADMINS.split(",")
  : [];
