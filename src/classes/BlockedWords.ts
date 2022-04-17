import * as Sentry from "@sentry/node";
import type { Message } from "discord.js";
import { LogEmbed } from "./LogEmbed";

export class BlockedWords {
  public async scan(message: Message) {
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    try {
      const blockedWords = (
        await message.client.db.FetchGuildSettings(message.guild)
      ).moderationSettings?.blockedWords;
      if (!blockedWords) return;

      for (const word of blockedWords) {
        if (message.content.toLowerCase().includes(word)) {
          if (!message.deletable) return await this.log(message, false, word);
          await message.delete();
          return await this.log(message, true, word);
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
    }
  }

  private async log(
    message: Message,
    successfullyDeleted: boolean,
    bannedWord: string
  ) {
    if (!message.guild) return;
    await message.client.guildLogger.log(
      message.guild,
      new LogEmbed(`blocked words`)
        .setColor("#4e73df")
        .setAuthor({
          name: `${message.author.tag} (${message.author.id})`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `${
            successfullyDeleted ? "Deleted" : "Failed to delete"
          } a message with a banned word`
        )
        .addField(
          "Message",
          `${message.content} ${
            successfullyDeleted
              ? `[Jump to message](${message.url})`
              : `[Jump to context](${message.url})`
          }`
        )
        .addField("Triggered Word", bannedWord)
    );
  }
}
