import { ReplyStatusEmbed } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "@evie/config";
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
    const userFilter = interaction.options.getUser("user");

    if (!messages || messages < 1 || messages > 100) {
      return void ReplyStatusEmbed(
        false,
        "You must specify an amount messages to purge below 100.",
        interaction
      );
    }

    if (userFilter) {
      try {
        const fetchedMessages = await interaction.channel.messages.fetch(
          {
            limit: messages,
          },
          {
            cache: true,
          }
        );

        const filteredMessages = fetchedMessages.filter((message) => {
          if (message.author.id === userFilter.id) return true;
          return false;
        });

        await interaction.channel.bulkDelete(filteredMessages);

        return void (await ReplyStatusEmbed(
          true,
          `${filteredMessages.size} messages purged.`,
          interaction
        ));
      } catch (e) {
        captureException(e);
        return void (await ReplyStatusEmbed(
          false,
          `Failed to purge messages.`,
          interaction
        ));
      }
    }

    try {
      await interaction.channel.bulkDelete(messages);

      return void (await ReplyStatusEmbed(
        true,
        `${messages} messages purged.`,
        interaction
      ));
    } catch (e) {
      captureException(e);
      return void (await ReplyStatusEmbed(
        false,
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
            required: true,
          },
          {
            name: "user",
            description: "User to filter by",
            type: "USER",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["974652396825354250"],
      }
    );
  }
}
