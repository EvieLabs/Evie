import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import ShapeGlobalCommandsToChoices from "#root/utils/misc/ShapeGlobalCommandsToChoices";
import { adminGuilds } from "#utils/parsers/envUtils";
import { inlineCode } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Delete global commands.",
  preconditions: ["OwnerOnly"],
})
export class DeleteGlobalCommand extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    const query = interaction.options.getString("query");
    if (!query) return;
    const command = await this.container.client.application?.commands.fetch(
      query
    );
    if (!command)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "No command found.",
        interaction
      );

    try {
      await command.delete();
      return void ReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `Deleted command ${command.name} (${inlineCode(command.id)})`,
        interaction
      );
    } catch (err) {
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Error deleting command.",
        interaction
      );
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    await interaction.respond(await ShapeGlobalCommandsToChoices(interaction));
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
            name: "query",
            description: "Command to delete",
            type: "STRING",
            autocomplete: true,
            required: true,
          },
        ],
      },
      {
        guildIds: adminGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
