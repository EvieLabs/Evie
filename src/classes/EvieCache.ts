import { EvieColors } from "#root/Enums";
import { hexStringToHexNumber } from "#root/utils/parsers/colorUtils";
import type { Guild, Snowflake } from "discord.js";

export class EvieCache {
  private embedColors = new Map<Snowflake, number>();

  public embedColor(guild: Guild): number {
    this.setEmbedColor(guild);
    return this.embedColors.get(guild.id) || EvieColors.eviePink;
  }

  public async setEmbedColor(guild: Guild): Promise<void> {
    const color = await guild.client.db.FetchGuildProperty(guild, "color");
    if (color)
      return void this.embedColors.set(
        guild.id,
        hexStringToHexNumber(color as string)
      );
  }
}
