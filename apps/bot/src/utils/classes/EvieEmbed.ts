import { Guild, MessageEmbed } from "discord.js";
import { MiscDB } from "../database/embedSettings";
import { ColorUtils } from "../parsers/colorUtils";

export async function EvieEmbed(guild: Guild | null): Promise<MessageEmbed> {
  const color = guild
    ? ColorUtils.hexStringToHexNumber((await MiscDB.getEC(guild)) ?? "#f47fff")
    : ColorUtils.hexStringToHexNumber("#f47fff");
  return new MessageEmbed().setColor(color).setTimestamp().setFooter({
    text: "Evie",
    iconURL: "https://www.eviebot.rocks/assets/EvieIcon.png",
  });
}
