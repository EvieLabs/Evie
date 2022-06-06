import { CreateTagModal } from "#constants/modals";
import {
  EditReplyStatusEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import EditTagMenu from "#root/components/config/EditTagMenu";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ShapeTagsToChoices } from "@evie/shapers";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  AutocompleteInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  Snowflake,
  SnowflakeUtil,
} from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Manage tags",
  requiredUserPermissions: ["MANAGE_GUILD"],
  preconditions: ["GuildOnly"],
})
export class ManageTags extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    switch (interaction.options.getSubcommand()) {
      case "create": {
        return void this.createTag(interaction);
      }
      case "delete": {
        return void this.deleteTag(interaction);
      }
      case "edit": {
        return void this.editTag(interaction);
      }
    }
  }

  private async editTag(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) return;
    const query = interaction.options.getString("query");
    if (!query) return;

    const tags = await interaction.client.db.FetchTags(interaction.guild);

    const tag =
      tags.find((tag) => tag.id === query) ??
      tags.find((tag) => tag.name === query.split(" ")[0]);

    if (!tag)
      return void EditReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Tag not found.",
        interaction
      );

    return void interaction.client.reacord.editReply(
      interaction,
      <EditTagMenu _tag={tag} user={interaction.user} />
    );
  }

  private async deleteTag(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) return;
    const query = interaction.options.getString("query");
    if (!query) return;

    const tags = await interaction.client.db.FetchTags(interaction.guild);

    const tag =
      tags.find((tag) => tag.id === query) ??
      tags.find((tag) => tag.name === query.split(" ")[0]);

    if (!tag)
      return void EditReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Tag not found.",
        interaction
      );

    return void (await interaction.client.prisma.evieTag
      .delete({
        where: {
          id: tag.id,
        },
      })
      .catch(() => {
        return void EditReplyStatusEmbed(
          StatusEmoji.FAIL,
          "Failed to delete tag.",
          interaction
        );
      })
      .then(() => {
        return void EditReplyStatusEmbed(
          StatusEmoji.SUCCESS,
          `Deleted tag ${tag.name}`,
          interaction
        );
      }));
  }

  private async createTag(interaction: CommandInteraction) {
    const generatedState = SnowflakeUtil.generate();
    const embed = interaction.options.getBoolean("embed") ?? false;
    await interaction.showModal(CreateTagModal(generatedState));
    this.waitForModal(interaction, embed, generatedState);
  }

  private async waitForModal(
    interaction: CommandInteraction,
    embed: boolean,
    state: Snowflake
  ) {
    const submit = (await interaction
      .awaitModalSubmit({
        filter: (i) => i.customId === `create_tag_${state}`,
        time: 100000,
      })
      .catch(() => {
        interaction.followUp({
          content: "Tag Creation timed out.",
          ephemeral: true,
        });
      })) as ModalSubmitInteraction;

    if (!submit) return;
    if (!submit.fields) return;

    const tag = submit.fields.getTextInputValue("tag_name");
    const content = submit.fields.getTextInputValue("tag_content");

    if (tag && content) {
      const { guild } = interaction;
      if (!guild) {
        ReplyStatusEmbed(
          StatusEmoji.FAIL,
          "You must be in a guild to create a tag.",
          submit
        );

        return;
      }

      return await interaction.client.prisma.evieTag
        .create({
          data: {
            id: SnowflakeUtil.generate(),
            name: tag,
            content: content,
            embed: embed,
            guildId: guild.id,
          },
        })
        .catch(() => {
          return ReplyStatusEmbed(
            StatusEmoji.FAIL,
            "Failed to create tag.",
            submit
          );
        })
        .then(() => {
          ReplyStatusEmbed(StatusEmoji.SUCCESS, `Created tag ${tag}`, submit);
        });
    } else {
      ReplyStatusEmbed(StatusEmoji.FAIL, "Tag creation failed.", submit);
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    await interaction.respond(await ShapeTagsToChoices(interaction));
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand((createSub) =>
            createSub //
              .setName("create")
              .setDescription("Create a tag")
              .addBooleanOption((embed) =>
                embed //
                  .setName("embed")
                  .setDescription("Whether the tag should be an embed")
                  .setRequired(true)
              )
          )
          .addSubcommand((deleteSub) =>
            deleteSub //
              .setName("delete")
              .setDescription("Delete a tag")
              .addStringOption((query) =>
                query //
                  .setName("query")
                  .setDescription("The name of the tag")
                  .setRequired(true)
                  .setAutocomplete(true)
              )
          )
          .addSubcommand((deleteSub) =>
            deleteSub //
              .setName("edit")
              .setDescription("Edit a tag")
              .addStringOption((query) =>
                query //
                  .setName("query")
                  .setDescription("The name of the tag")
                  .setRequired(true)
                  .setAutocomplete(true)
              )
          ),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["976395420555153438"],
      }
    );
  }
}
