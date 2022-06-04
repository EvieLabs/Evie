import PaginateComponent from "#root/components/info/PaginateComponent";
import { Emojis } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { ApplyOptions } from "@sapphire/decorators";
import { Command, container } from "@sapphire/framework";

import type { Message } from "discord.js";
import React from "react";

@ApplyOptions<Command.Options>({
  description: "Show command list",
  name: "help",
  aliases: ["cmds", "commands"],
})
export class Help extends Command {
  private categorizeCommands(commandStore: Command[]): {
    [key: string]: Command[];
  } {
    const categories: { [key: string]: Command[] } = {};
    for (const command of commandStore) {
      if (command.category) {
        if (!categories[command.category]) {
          categories[command.category] = [];
        }
        categories[command.category].push(command);
      }
    }
    return categories;
  }

  public override async messageRun(message: Message) {
    const commands = this.categorizeCommands(
      container.stores.get("commands").map((command) => command)
    );

    const disclaimer = [
      "Thanks for using Evie! All moderation and some of our most used commands are slash commands, the rest are text-based.",
      "My prefixes are `evie ` and `ev!`.",
      "",
      "p.s This page will have patch-notes and other updates in the future.",
    ].join("\n");

    message.client.reacord.messageReply(
      message,
      <PaginateComponent
        user={message.author}
        pages={[
          {
            title: "Evie",
            description: disclaimer,
          },
          ...Object.keys(commands).map((category) => ({
            title: category,
            description: commands[category]
              .map((command) =>
                removeIndents(`
                 ${command.contextMenuRun ? Emojis.contextMenu : ""} ** ${
                  command.chatInputRun ? Emojis.slashCommand : ""
                } ${command.messageRun ? "ev!" : ""}\`${command.name}\`** 
            > ${command.description} 
          `)
              )
              .join(""),
          })),
        ]}
      />
    );
  }
}
