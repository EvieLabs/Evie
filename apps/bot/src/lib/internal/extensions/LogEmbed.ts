import { MessageEmbed } from "discord.js";
import { EvieColors } from "#root/Enums";

export class LogEmbed extends MessageEmbed {
	public constructor(footerText?: string) {
		super();
		this.setTimestamp();
		this.setColor(EvieColors.evieGrey);
		this.setFooter({
			text: `Evie${footerText ? ` | ${footerText}` : ""}`,
		});
	}
}
