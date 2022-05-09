import { EvieEmbed } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Send a tag",
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

    const tag = await (
      await interaction.client.db.FetchTags(interaction.guild)
    ).find((tag) => tag.id === query);
    if (!tag) {
      const tag = (
        await interaction.client.db.FetchTags(interaction.guild)
      ).find((tag) => tag.name === query.split(" ")[0]);
      if (tag) {
        const e = new EvieEmbed(interaction.guild);
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
    const e = new EvieEmbed(interaction.guild);
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
    if (!interaction.guild) return;
    const tagData = await interaction.client.db.FetchTags(interaction.guild);
    const query = interaction.options.getString("query") ?? "";

    if (tagData.length == 0) {
      return await interaction.respond([
        {
          name: "📌Create a new tag with /createtag",
          value: "create",
        },
      ]);
    }

    const tags = tagData
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase()) ||
          tag.content.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map((tag) => ({
        name: tag.name,
        id: tag.id,
      }));

    return await interaction.respond(
      tags.map((tag) => {
        return {
          name: `📌${tag.name}`,
          value: tag.id,
        };
      })
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
        idHints: ["954547164539912294"],
      }
    );
  }
}
