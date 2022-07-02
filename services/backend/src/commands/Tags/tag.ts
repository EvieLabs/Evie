import { registeredGuilds } from "@evie/config";
import { EvieEmbed } from "@evie/internal";
import { ShapeTagsToChoices } from "@evie/shapers";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Send a tag",
  preconditions: ["GuildOnly"],
})
export class Tag extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    const query = interaction.options.getString("query");
    const target = interaction.options.getMember("target");

    if (!interaction.guild) return;
    if (!query) return;
    if (!interaction.member) return;

    const tag = (await interaction.client.db.FetchTags(interaction.guild)).find(
      (tag) => tag.id === query
    );
    if (!tag) {
      const tag = (
        await interaction.client.db.FetchTags(interaction.guild)
      ).find((tag) => tag.name === query.split(" ")[0]);
      if (tag) {
        const e = new EvieEmbed();
        e.setTitle(tag.name);
        e.setDescription(tag.content);
        if (tag.embed) {
          interaction.reply({
            embeds: [e],
          });
        } else {
          interaction.reply({
            content: tag.content,
          });
        }
      } else {
        interaction.reply({
          content: `No tag found with the name \`${query}\``,
        });
      }
      return;
    }
    const e = new EvieEmbed();
    e.setTitle(tag.name);
    e.setDescription(tag.content);
    if (tag.embed) {
      interaction.reply({
        [target
          ? "content"
          : ""]: `Hey, ${target}! ${interaction.user} thinks this will be useful for you!`,

        embeds: [e],
        allowedMentions: {},
      });
    } else {
      interaction.reply({
        content: `${
          target
            ? `Hey, ${target}! ${interaction.user} thinks this will be useful for you!\n`
            : ""
        }${tag.content}`,
        allowedMentions: {},
      });
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    await interaction.respond(await ShapeTagsToChoices(interaction));
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
            description: "The name of the tag",
            type: "STRING",
            autocomplete: true,
            required: true,
          },
          {
            name: "target",
            description: "Targeted user",
            type: "USER",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954566145183191090"],
      }
    );
  }
}
