import { MessageEmbed } from "discord.js";

export class LogEmbed extends MessageEmbed {
  public constructor(footerText?: string) {
    super();
    this.setTimestamp();
    this.setFooter({
      text: `Evie${footerText ? ` | ${footerText}` : ""}`,
      iconURL: "https://eviebot.rocks/assets/EvieIcon.png",
    });
  }
}
