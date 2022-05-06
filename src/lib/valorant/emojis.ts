import { ValorantTierEmojis } from "#root/constants/index";
import type { MMRDataV2, Season } from "#root/types/api/HenrikValorant";

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

/**
 * Find the Season the player had the highest final_rank
 * @param compStats The competitive stats of the player
 */
export function getPeakSeason(compStats: MMRDataV2): Season {
  const seasons = Object.keys(compStats.by_season);
  const highestSeason = seasons.reduce((acc, season) => {
    if (acc.final_rank > compStats.by_season[season].final_rank) {
      return acc;
    }
    return compStats.by_season[season];
  }, compStats.by_season[seasons[0]]);
  return highestSeason;
}
