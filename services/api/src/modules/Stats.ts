import type { ShardStats } from "@prisma/client";
import { container } from "@sapphire/pieces";
import { statsTemplate } from "../constants/statsTemplate";
import type { ProcessedStats } from "../types";
import { Puppeteer } from "./Puppeteer";

export class Stats {
  private static processStats(stats: ShardStats[]): ProcessedStats {
    const servers = stats.reduce((acc, curr) => acc + curr.guilds, 0);
    const users = stats.reduce((acc, curr) => acc + curr.users, 0);
    const shards = stats.length;
    const shardAvgPing =
      stats.reduce((acc, curr) => acc + curr.wsPing, 0) / stats.length;

    return { servers, users, shards, shardAvgPing };
  }

  public static async getStats(): Promise<ProcessedStats> {
    const stats = await container.prisma.shardStats.findMany();
    return this.processStats(stats);
  }

  public static async renderStats(): Promise<Buffer> {
    const stats = await this.getStats();
    const image = await Puppeteer.RenderHTML(statsTemplate(stats), {
      width: 640,
      height: 80,
      omitBackground: true,
    });
    return image;
  }
}
