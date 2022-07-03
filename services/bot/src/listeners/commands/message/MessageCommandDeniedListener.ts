import { ReplyStatusEmbed } from "@evie/internal";
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
    return void ReplyStatusEmbed(false, `${error.message}`, message);
  }
}
