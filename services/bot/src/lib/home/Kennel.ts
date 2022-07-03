import { getSecret } from "@evie/config";
import { container, Events } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { MessageOptions, Snowflake, TextBasedChannel } from "discord.js";

export class Kennel {
  private channel: TextBasedChannel | null = null;

  public constructor(channelSnowflake: Snowflake) {
    container.client.once(Events.ClientReady, async () => {
      container.logger.debug(
        `Initializing Kennel with channel ${channelSnowflake}`
      );
      try {
        this.channel = await container.client.channels
          .fetch(channelSnowflake)
          .then((channel) => (channel?.isText() ? channel : null));
      } catch (e) {
        captureException(e);
      }
    });
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
