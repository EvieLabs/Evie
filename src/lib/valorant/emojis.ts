import { ValorantTierEmojis } from "#root/constants/index";

/**
 * Returns the emoji for the given tier
 * @param tier The tier to get the emoji for in the form of "Iron 1"
 * @returns A Discord emoji string if the emojis is found, otherwise the original string is returned
 * @example ```js
 * getEmojiForTier("Iron 1")
 * // => "<:iron_1:971675215203553320>"
 * ```
 */
export function getCompTierEmoji(tier: string): string {
  return `<:${
    ValorantTierEmojis.filter(
      (e) => e.name === tier.toLowerCase().replaceAll(" ", "_") ?? ""
    )[0].identifier
  }>`;
}
