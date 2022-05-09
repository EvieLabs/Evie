import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { ApplyOptions } from "@sapphire/decorators";
import {
  Events,
  Listener,
  ListenerOptions,
  MessageCommandDeniedPayload,
  UserError,
} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({ event: Events.MessageCommandDenied })
export class MessageCommandDeniedListener extends Listener {
  public run(error: UserError, { message }: MessageCommandDeniedPayload) {
    return void ReplyStatusEmbed(StatusEmoji.FAIL, `${error.message}`, message);
  }
}
