/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { ImportMessageModal } from "#root/constants/modals";
import { miscDB } from "#root/utils/database/misc";
import { informNeedsPerms, PermissionLang } from "#root/utils/misc/perms";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  ModalSubmitInteraction,
  Permissions,
  Snowflake,
  SnowflakeUtil,
  TextChannel,
} from "discord.js";

export class ImportMessage extends Command {
  public override async chatInputRun(
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) return;

    const perms: Permissions = interaction.member?.permissions as Permissions;
    const channel = interaction.options.getChannel("channel");

    if (!(channel instanceof TextChannel)) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Please provide a valid text channel.",
        interaction
      );
      return;
    }

    if (!perms.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return informNeedsPerms(interaction, PermissionLang.MANAGE_MESSAGES);
    }

    if (
      !channel
        .permissionsFor(interaction.member)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You do not have permission to send messages in this channel.",
        interaction
      );
      return;
    }

    if (
      !interaction.guild.me
        ?.permissionsIn(channel)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "I do not have permission to send messages in this channel.",
        interaction
      );
      return;
    }

    const generatedState = SnowflakeUtil.generate();

    await interaction.showModal(ImportMessageModal(generatedState));
    this.waitForModal(interaction, channel, generatedState);
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild()) return;

    const message = interaction.options.getMessage("message", true);

    if (!message) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Please provide a valid message.`,
        interaction
      );
      return;
    }

    if (message.author.id !== interaction.client.user?.id) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Please Provide a message that was sent by me.
        This context menu is used to edit messages you made me send.
        For more information, read the [documentation on this feature](https://docs.eviebot.rocks/commands/import-message.html).`,
        interaction
      );
      return;
    }

    if (
      !(await miscDB.getImportedMessages(interaction.guild)).includes(
        message.id
      )
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Please don't try and edit a message that is not user-generated.`,
        interaction
      );
      return;
    }

    const perms: Permissions = interaction.member?.permissions as Permissions;

    if (!perms.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      informNeedsPerms(interaction, PermissionLang.MANAGE_MESSAGES);
      return;
    }

    if (
      !message.channel
        .permissionsFor(interaction.member)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You do not have permission to send messages in this channel.",
        interaction
      );
      return;
    }

    if (
      !interaction.guild.me
        ?.permissionsIn(message.channel)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "I do not have permission to edit messages in this channel.",
        interaction
      );
      return;
    }

    const generatedState = SnowflakeUtil.generate();

    await interaction.showModal(ImportMessageModal(generatedState));

    this.waitForModal(
      interaction as CommandInteraction,
      message.channel as TextChannel,
      generatedState,
      message
    );
  }

  private async waitForModal(
    interaction: CommandInteraction,
    channel: TextChannel,
    stateflake: Snowflake,
    existingMessage?: Message
  ) {
    const submit = (await interaction
      .awaitModalSubmit({
        filter: (i) => i.customId === `import_msgjson_${stateflake}`,
        time: 100000,
      })
      .catch(() => {
        ReplyStatusEmbed(StatusEmoji.FAIL, `Import Timed Out`, interaction);
      })) as ModalSubmitInteraction;

    if (!submit) return;
    if (!submit.fields) return;

    const jsonData = submit.fields.getTextInputValue("json_data");

    if (jsonData) {
      try {
        if (existingMessage) {
          const json = JSON.parse(jsonData);

          const message = await existingMessage.edit(json);

          await miscDB.addImportedMessage(message);

          return ReplyStatusEmbed(
            StatusEmoji.SUCCESS,
            `Imported [here](<${message.url}>)!`,
            submit
          );
        } else {
          const json = JSON.parse(jsonData);

          const message = await channel.send(json);
          await miscDB.addImportedMessage(message);

          return ReplyStatusEmbed(
            StatusEmoji.SUCCESS,
            `Imported [here](<${message.url}>)!`,
            submit
          );
        }
      } catch (e) {
        console.log(e);
        await ReplyStatusEmbed(StatusEmoji.FAIL, `Failed to import`, submit);
      }
    } else {
      await ReplyStatusEmbed(StatusEmoji.FAIL, `Missing JSON Data`, submit);
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Edit Message")
          .setType(ApplicationCommandType.Message),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954547076920930354"],
      }
    );

    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Sends Discord Message JSON as a message",
        options: [
          {
            name: "channel",
            description: "Channel to send the message to",
            type: "CHANNEL",
            required: true,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954547077650735114"],
      }
    );
  }
}
