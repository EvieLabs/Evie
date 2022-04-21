import { container } from "@sapphire/framework";
import type { Client } from "discord.js";
import cron from "node-cron";

export class Schedule {
  public constructor(
    private readonly cronExpression: string,
    private readonly client: Client
  ) {
    container.logger.debug(
      `[SCHEDULE]: Loaded new schedule ${this.constructor.name} for ${this.cronExpression}`
    );
    cron.schedule(this.cronExpression, () => {
      container.logger.debug(
        `[SCHEDULE]: [${new Date().toLocaleString()}] Running scheduled task ${
          this.constructor.name
        }...`
      );
      this.execute(this.client);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(client: Client) {
    throw new Error("Method not implemented.");
  }
}
