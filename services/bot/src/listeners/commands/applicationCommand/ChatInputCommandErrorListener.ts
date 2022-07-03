import { EditReplyStatusEmbed, ReplyStatusEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ArgumentError,
  ChatInputCommandErrorPayload,
  Events,
  Listener,
  ListenerOptions,
  UserError,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { captureException } from "@sentry/node";

@ApplyOptions<ListenerOptions>({ event: Events.ChatInputCommandError })
export class ChatInputCommandErrorListener extends Listener {
  public async run(
    error: Error,
    { interaction }: ChatInputCommandErrorPayload
  ) {
    if (error instanceof UserError || error instanceof ArgumentError) {
      return interaction.deferred
        ? void EditReplyStatusEmbed(false, `${error.message}`, interaction)
        : void ReplyStatusEmbed(false, `${error.message}`, interaction);
    } else if (typeof error === "string") {
      return interaction.deferred
        ? void EditReplyStatusEmbed(false, error, interaction)
        : void ReplyStatusEmbed(false, error, interaction);
    } else {
      captureException(error);
      return interaction.deferred
        ? void EditReplyStatusEmbed(
            false,
            await resolveKey(interaction, "errors:commandError"),
            interaction
          )
        : void ReplyStatusEmbed(
            false,
            await resolveKey(interaction, "errors:commandError"),
            interaction
          );
    }
  }
}