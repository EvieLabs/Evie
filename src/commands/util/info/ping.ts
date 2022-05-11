import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

export class Ping extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "ping",
      aliases: ["pong"],
      description: "ping pong",
    });
  }

  public override async messageRun(message: Message) {
    const e = "";
    const msg = await message.reply("**!** `e v i e` **!**");

    const content = `\`\`\`ansi
    ${e}[34;49mBot Latency: ${e}[32;49m${Math.round(
      this.container.client.ws.ping
    )} ${e}[39;49mms
    ${e}[36;49mAPI Latency: ${e}[32;49m${
      msg.createdTimestamp - message.createdTimestamp
    } ${e}[39;49mms\`\`\``;

    return msg.edit(content);
  }
}
