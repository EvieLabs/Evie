import { ApplyOptions } from "@sapphire/decorators";
import {
  ChatInputCommand,
  Events,
  Listener,
  ListenerOptions,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<ListenerOptions>({ event: Events.ChatInputCommandRun })
export class ChatInputCommandRunListener extends Listener {
  public async run(_: CommandInteraction, command: ChatInputCommand) {
    await this.container.client.prisma.commandStats.upsert({
      where: {
        name: command.name,
      },
      update: {
        uses: {
          increment: 1,
        },
      },
      create: {
        name: command.name,
        category: command.category,
        uses: 1,
      },
    });
  }
}
