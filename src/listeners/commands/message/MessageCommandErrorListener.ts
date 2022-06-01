import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ArgumentError,
  Events,
  Listener,
  ListenerOptions,
  MessageCommandErrorPayload,
  UserError,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { captureException } from "@sentry/node";

@ApplyOptions<ListenerOptions>({ event: Events.MessageCommandError })
export class MessageCommandErrorListener extends Listener {
  public async run(error: Error, { message }: MessageCommandErrorPayload) {
    if (error instanceof UserError || error instanceof ArgumentError) {
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `${error.message}`,
        message
      );
    } else if (typeof error === "string") {
      return void ReplyStatusEmbed(StatusEmoji.FAIL, error, message);
    } else {
      captureException(error);
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        await resolveKey(message, "errors:commandError"),
        message
      );
    }
  }
}
