import { Command } from "@sapphire/framework";
import { Message, MessageAttachment } from "discord.js";

export class ResetApp extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "guild object",
      aliases: ["go"],
      preconditions: ["OwnerOnly"],
    });
  }

  public override async messageRun(message: Message) {
    return message.reply({
      files: [
        new MessageAttachment(
          Buffer.from(JSON.stringify(message.guild?.toJSON(), null, 2)),
          `${message.guildId}.json`
        ),
      ],
    });
  }
}
