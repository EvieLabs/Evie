import { eviePink } from "#root/constants/config";
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
      color: guild ? guild.client.db.cache.embedColor(guild) : eviePink,
      timestamp: Date.now().toString(),
      footer: {
        text: "Evie",
        iconURL: "https://evie.pw/assets/EvieIcon.png",
      },
    });
  }
}

export class StatusEmbed extends MessageEmbed {
  constructor(public status: StatusEmoji, public statusMessage: string) {
    super({
      color: status === StatusEmoji.SUCCESS ? 0x00ff00 : 0xff0000,
      timestamp: Date.now().toString(),
      footer: {
        text: "Evie",
        iconURL: "https://evie.pw/assets/EvieIcon.png",
      },
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
  const embed = new MessageEmbed()
    .setColor(status === StatusEmoji.SUCCESS ? "#00ff00" : "#ff0000")
    .setTimestamp()
    .setFooter({
      text: "Evie",
      iconURL: "https://evie.pw/assets/EvieIcon.png",
    })
    .setDescription(`${status} ${description}`);

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
