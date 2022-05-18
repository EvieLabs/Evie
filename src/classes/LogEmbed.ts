import { colors } from "#root/constants/config";
import { MessageEmbed } from "discord.js";

export class LogEmbed extends MessageEmbed {
  public constructor(footerText?: string) {
    super();
    this.setTimestamp();
    this.setColor(colors.evieGrey);
    this.setFooter({
      text: `Evie${footerText ? ` | ${footerText}` : ""}`,
    });
  }
}
