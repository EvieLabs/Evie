import type { CommandStats } from "@prisma/client";
import { container } from "@sapphire/framework";
import { execSync } from "node:child_process";
export class Stats {
  public get users(): number {
    return container.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
  }

  public static commitSha = execSync("git rev-parse HEAD").toString().trim();

  public static commitName = execSync("git log -1 --pretty=%an")
    .toString()
    .trim();

  public static commitNumber = execSync("git rev-list --all --count")
    .toString()
    .trim();

  public static currentBranch = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();

  public async getCommandStats(): Promise<CommandStats[]> {
    return await container.client.prisma.commandStats.findMany();
  }

  public get guilds(): number {
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
