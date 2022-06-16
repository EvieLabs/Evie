import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  container,
  RegisterBehavior,
} from "@sapphire/framework";

import HelpComponent from "#root/components/info/HelpComponent";
import { Emojis } from "#root/Enums";
import { registeredGuilds } from "@evie/config";
import { resolveKey } from "@sapphire/plugin-i18next";
import { CommandInteraction, Message } from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Ready to get started with Evie?",
  name: "getstarted",
  aliases: ["cmds", "commands", "help", "getstarted"],
})
export class GetStarted extends Command {
  private async getStarted(ctx: Message | CommandInteraction) {
    const commands = await this.categorizeCommands(
      container.stores.get("commands").map((command) => command),
      ctx
    );

    const description = [
      await resolveKey(ctx, "commands/getstarted:description"),
      await resolveKey(
        ctx,
        "commands/getstarted:onlyShowingCommandsYouHavePermsFor"
      ),
    ].join("\n\n");
    const title = await resolveKey(ctx, "commands/getstarted:title", {
      emoji: Emojis.evie,
    });

    return {
      title,
      description,
      commands,
    };
  }

  public override async messageRun(message: Message) {
    const { title, description, commands } = await this.getStarted(message);

    message.client.reacord.messageReply(
      message,
      <HelpComponent
        infoEmbed={{
          title,
          description,
        }}
        user={message.author}
        commands={commands}
      />
    );
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const { title, description, commands } = await this.getStarted(interaction);

    interaction.client.reacord.editReply(
      interaction,
      <HelpComponent
        infoEmbed={{
          title,
          description,
        }}
        user={interaction.user}
        commands={commands}
      />
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["986491248544215070"],
      }
    );
  }

  private async categorizeCommands(
    commandStore: Command[],
    context: Message | CommandInteraction
  ): Promise<{
    [key: string]: Command[];
  }> {
    const categories: { [key: string]: Command[] } = {};
    for (const command of commandStore) {
      if (command.category) {
        const parsedCategory = `${command.category}${
          command.subCategory ? `/${command.subCategory}` : ""
        }`;

        if (!categories[parsedCategory]) {
          categories[parsedCategory] = [];
        }

        const precons =
          context instanceof Message
            ? await command.preconditions.messageRun(
                context,
                command as never,
                {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  command: null!,
                }
              )
            : await command.preconditions.chatInputRun(
                context,
                command as never,
                {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  command: null!,
                }
              );

        if (!precons.success) continue;

        categories[parsedCategory].push(command);
      }
    }

    for (const key in categories) {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    }

    return categories;
  }
}
