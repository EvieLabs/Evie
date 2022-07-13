import { EventHook, Module } from "@evie/internal";
import { Events } from "@sapphire/framework";
import { Message, Snowflake } from "discord.js";

export class HelloDatabase extends Module {
	public constructor(context: Module.Context, options: Module.Options) {
		super(context, {
			...options,
			name: "HelloDatabase",
		});
	}

	public async getConfig(guildId: Snowflake) {
		const config = await this._getConfig(guildId);
		return config;
	}

	@EventHook(Events.MessageCreate)
	public async message(message: Message) {
		if (message.content === "!dbtest" && message.guild) {
			const config = await this.getConfig(message.guild.id);
			console.log(config);
		}
	}
}
