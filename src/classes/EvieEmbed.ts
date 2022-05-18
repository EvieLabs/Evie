import { colors } from "#root/constants/config";
import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageEmbed,
  MessageMentionOptions,
  ModalSubmitInteraction,
  type Guild,
} from "discord.js";
import type { APIMessage } from "discord.js/node_modules/discord-api-types/v9";

export enum StatusEmoji {
  SUCCESS = "<a:success:952340083418230874>",
  FAIL = "<a:fail:952340157858709594>",
}

export class EvieEmbed extends MessageEmbed {
  public constructor(public guild?: Guild | null) {
    super({
      color: colors.evieGrey,
      timestamp: Date.now().toString(),
    });
  }
}

export class StatusEmbed extends MessageEmbed {
  constructor(public status: StatusEmoji, public statusMessage: string) {
    super({
      color: status === StatusEmoji.SUCCESS ? colors.evieGrey : 0xff0000,
      timestamp: Date.now().toString(),
      description: `${status} ${statusMessage}`,
    });
  }
}

export async function ReplyStatusEmbed(
  status: StatusEmoji,
  description: string,
  i:
    | CommandInteraction
    | ModalSubmitInteraction
    | ContextMenuInteraction
    | ButtonInteraction
    | Message,
  allowedMentions?: MessageMentionOptions
): Promise<Message | Message<boolean> | APIMessage | void> {
  const embed = new StatusEmbed(status, description);

  if (i instanceof Message)
    return i.reply({ embeds: [embed], allowedMentions: allowedMentions });

  return i.replied
    ? i.followUp({
        embeds: [embed],
        ephemeral: true,
        allowedMentions: allowedMentions,
      })
    : i.reply({
        embeds: [embed],
        ephemeral: true,
        allowedMentions: allowedMentions,
      });
}

export async function EditReplyStatusEmbed(
  status: StatusEmoji,
  description: string,
  i:
    | CommandInteraction
    | ModalSubmitInteraction
    | ContextMenuInteraction
    | ButtonInteraction
    | Message,
  allowedMentions?: MessageMentionOptions
): Promise<Message | Message<boolean> | APIMessage | void> {
  const embed = new StatusEmbed(status, description);

  if (i instanceof Message)
    return i.edit({ embeds: [embed], allowedMentions: allowedMentions });

  return i.editReply({
    embeds: [embed],
    allowedMentions: allowedMentions,
  });
}
