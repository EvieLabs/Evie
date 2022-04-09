import { CreateTagModal } from "#constants/modals";
import { tagDB } from "#root/utils/database/tags";
import { informNeedsPerms, PermissionLang } from "#root/utils/misc/perms";
import { registeredGuilds } from "#utils/parsers/envUtils";
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
        submit.reply({
          content: "You must be in a guild to create a tag.",
          ephemeral: true,
        });
        return;
      }
      tagDB.addTag(
        {
          id: SnowflakeUtil.generate(),
          name: tag,
          content,
          embed,
          guildId: guild.id,
        },
        guild
      );
      submit.reply({ content: `Created tag ${tag}`, ephemeral: true });
    } else {
      submit.reply({
        content: "Tag creation failed.",
        ephemeral: true,
      });
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Creates a new tag",
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
