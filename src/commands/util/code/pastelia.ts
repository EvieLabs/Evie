import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import axios from "axios";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { ContextMenuInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Uploads code to Pastelia",
})
export class Pastelia extends Command {
  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild()) return;

    const message = interaction.options.getMessage("message", true);

    if (!message) {
      return void (await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Please provide a valid message.`,
        interaction
      ));
    }

    const { content } = message;

    const parsed = content.match(/```(.*?)\n/);
    const language = parsed ? (parsed[1] === "" ? "auto" : parsed[1]) : "auto";
    const code = content.replace(/```(.*?)\n/, "").replace(/```/g, "");

    try {
      const response = await axios.post("https://api.pastelia.dev/", {
        code,
        lang: language,
      });

      const { data } = response;
      await message.delete();
      return void interaction.reply(
        `Uploaded code block to [Pastelia](<https://pastelia.dev/${data}>).`
      );
    } catch (e) {
      captureException(e);
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `An error occured while uploading your code.`,
        interaction
      );
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Upload to Pastelia")
          .setType(ApplicationCommandType.Message),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
