import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { CommandInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Purge messages",
  requiredUserPermissions: ["MANAGE_MESSAGES"],
  requiredClientPermissions: ["MANAGE_MESSAGES"],
  preconditions: ["GuildOnly"],
})
export class Purge extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild() || !interaction.channel) return;
    const messages = interaction.options.getInteger("messages");

    if (!messages)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You must specify how many messages to purge.",
        interaction
      );

    try {
      await interaction.channel.bulkDelete(messages);
      return void (await ReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `${messages} messages purged.`,
        interaction
      ));
    } catch (e) {
      captureException(e);
      return void (await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Failed to purge ${messages} messages.`,
        interaction
      ));
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "messages",
            description: "Messages to delete",
            type: "INTEGER",
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
