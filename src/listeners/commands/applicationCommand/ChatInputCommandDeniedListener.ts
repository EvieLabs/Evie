import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ChatInputCommandDeniedPayload,
  Events,
  Listener,
  ListenerOptions,
  UserError,
} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({ event: Events.ChatInputCommandDenied })
export class ChatInputCommandDeniedListener extends Listener {
  public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    return void ReplyStatusEmbed(
      StatusEmoji.FAIL,
      `${error.message}`,
      interaction
    );
  }
}
