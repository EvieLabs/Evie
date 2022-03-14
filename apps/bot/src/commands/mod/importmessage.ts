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

import { StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { ImportMessageModal } from "#root/constants/modals";
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
      return interaction.reply({
        content: "Please provide a valid text channel.",
        ephemeral: true,
      });
    }

    if (!perms.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return informNeedsPerms(interaction, PermissionLang.MANAGE_MESSAGES);
    }

    if (
      !channel
        .permissionsFor(interaction.member)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "You do not have permission to send messages in this channel.",
        interaction
      );
    }

    if (
      !interaction.guild.me
        ?.permissionsIn(channel)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return await StatusEmbed(
        StatusEmoji.FAIL,
        "I do not have permission to send messages in this channel.",
        interaction
      );
    }

    const generatedState = SnowflakeUtil.generate();

    await interaction.showModal(ImportMessageModal(generatedState));
    this.waitForModal(interaction, channel, generatedState);
  }

  private async waitForModal(
    interaction: CommandInteraction,
    channel: TextChannel,
    stateflake: Snowflake
  ) {
    const submit = (await interaction
      .awaitModalSubmit({
        filter: (i) => i.customId === `import_msgjson_${stateflake}`,
        time: 100000,
      })
      .catch(() => {
        interaction.followUp({
          content: "Message JSON import timed out.",
          ephemeral: true,
        });
      })) as ModalSubmitInteraction;

    if (!submit) return;
    if (!submit.fields) return;

    const jsonData = submit.fields.getTextInputValue("json_data");

    if (jsonData) {
      const json = JSON.parse(jsonData);

      await submit.reply({
        content: "Importing...",
        ephemeral: true,
      });
      try {
        const message = await channel.send(json);
        await submit.editReply({
          content: `Imported [here](<${message.url}>)!`,
        });
      } catch (e) {
        await submit.editReply({
          content: "Failed to import.",
        });
      }
    } else {
      submit.reply({
        content: "Missing JSON data.",
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
      }
    );
  }
}
