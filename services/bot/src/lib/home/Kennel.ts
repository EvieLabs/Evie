import { getSecret } from "@evie/config";
import { container, Events } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { BaseGuildTextChannel, MessageOptions, Snowflake } from "discord.js";

export class Kennel {
	private channel: BaseGuildTextChannel | null = null;

	public constructor(channelSnowflake: Snowflake) {
		container.client.once(Events.ClientReady, async () => {
			container.logger.debug(`Initializing Kennel with channel ${channelSnowflake}`);
			try {
				this.channel = await container.client.channels
					.fetch(channelSnowflake)
					.then((channel) => (channel instanceof BaseGuildTextChannel ? channel : null));
			} catch (e) {
				captureException(e);
			}
		});
	}

	public get guildId() {
		return this.channel?.guildId ?? 0;
	}

	public async send(message: MessageOptions) {
		if (!this.channel) throw new Error("Channel not initialized/found!");
		return this.channel.send(message).then((message) => {
			message.crosspostable &&
				getSecret("NODE_ENV", false) === "production" &&
				message.crosspost().catch((e) => {
					captureException(e);
				});
			return message;
		});
	}
}
