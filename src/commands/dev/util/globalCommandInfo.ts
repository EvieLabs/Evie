import {
  EvieEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import { adminGuilds } from "#utils/parsers/envUtils";
import { time } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  AutocompleteInteraction,
  CommandInteraction,
  SnowflakeUtil,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Get information about global commands.",
  preconditions: ["OwnerOnly"],
})
export class GlobalCommandInfo extends Command {
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
    const a = "➤";
    const embed = new EvieEmbed();
    embed.setTitle(command.name);
    embed.setDescription(`${a} **Description**: \`${command.description}\`
    ${a} **ID**: \`${command.id}\`
    ${a} **Registered**: ${time(
      SnowflakeUtil.deconstruct(command.id).date,
      "R"
    )}`);
    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    const commands = await this.container.client.application?.commands.fetch();
    const query = interaction.options.getString("query") ?? "";

    return interaction.respond(
      commands
        ? commands
            .map((command) => ({
              name: command.name,
              value: command.id,
            }))
            .filter((command) =>
              command.name.toLowerCase().includes(query.toLowerCase())
            )
        : [
            {
              name: "No commands found",
              value: "none",
            },
          ]
    );
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
            description: "Command to view",
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
