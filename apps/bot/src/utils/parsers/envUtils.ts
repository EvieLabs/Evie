export function getGuildIDS() {
  return process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : [];
}
