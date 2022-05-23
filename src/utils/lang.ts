export enum Emojis {
  evieWristSlap = "<:evieWS:969902527325831208>",
  valorantLogo = "<:valorant:971373514152095755>",
  valorantRadiant = "<:radiant:971675273911218196>",
  valorantFade = "<:fade:973184566321893417>",
}

export const discordServerInvite = "https://discord.gg/Sx9QzpVC7r";

const lang = {
  needAdminPerms:
    "You do not have the required permissions to use this command. (admin)",
  messageComponentNotForYou: `This button is not for you! ${Emojis.evieWristSlap}`,
  reacordInteractionExpired: `This instance has expired and no longer exists! Try re-running the command.`,
  commandModeratorOnly: `This command is only available to moderators. ${Emojis.evieWristSlap}`,
  commandModeratorOnlyNoEmoji: `This command is only available to moderators. ${Emojis.evieWristSlap}`,
  notInCachedGuild: `You are not in a cached guild. Try re-running the command.`,
  boosterOnly: `Sorry, this feature is only available for people who boost our [server](${discordServerInvite}).
  While we try to keep as many features as possible free, we still want to make some profits in return weather that be in Discord server boosts or from donations.`,
  noModOrTarget: `You need to specify a moderator and/or target.`,
};

export default lang;
