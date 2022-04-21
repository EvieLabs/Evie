import { container } from "@sapphire/framework";
import { Collection } from "discord.js";

export class Stats {
  private interactionsUsed = new Collection<string, number>();

  public constructor() {
    container.client.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;

      const old = this.interactionsUsed.get(interaction.commandName);
      if (!old)
        return void this.interactionsUsed.set(interaction.commandName, 1);
      return void this.interactionsUsed.set(interaction.commandName, old + 1);
    });
  }

  public get commandStats(): { commandName: string; used: number }[] {
    try {
      return this.interactionsUsed
        .map((used, commandName) => ({
          commandName,
          used,
        }))
        .sort((a, b) => b.used - a.used);
    } finally {
      this.interactionsUsed.clear();
    }
  }

  public get users(): number {
    return container.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
  }

  public get guilds(): number {
    return container.client.guilds.cache.reduce((acc) => acc + 1, 0);
  }

  public get cpuUsage(): number {
    return container.client.guilds.cache.reduce((acc) => acc + 1, 0);
  }

  public get wsPing(): number {
    return container.client.ws.ping;
  }

  public get unavailableGuilds(): number {
    return container.client.guilds.cache.filter((guild) => !guild.available)
      .size;
  }
}
