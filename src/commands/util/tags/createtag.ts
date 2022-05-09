import { CreateTagModal } from "#constants/modals";
import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { informNeedsPerms, PermissionLang } from "#root/utils/misc/perms";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  CommandInteraction,
  ModalSubmitInteraction,
  Permissions,
  Snowflake,
  SnowflakeUtil,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Creates a new tag",
})
export class CreateTag extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    const perms: Permissions = interaction.member?.permissions as Permissions;

    if (!perms.has(Permissions.FLAGS.MANAGE_GUILD)) {
      return informNeedsPerms(interaction, PermissionLang.MANAGE_SERVER);
    }

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

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "embed",
            description: "Make the tag an embed",
            type: "BOOLEAN",
            required: true,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954547163965300766"],
      }
    );
  }
}
