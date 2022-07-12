import { blue, magenta } from "colorette";
import type { ShardingManager } from "discord.js";
import cron from "node-cron";

export class ShardManagerSchedule {
	public constructor(private readonly cronExpression: string, private readonly manager: ShardingManager) {
		console.log(magenta(`[SHARD-SCHEDULE]`), `Loaded new schedule ${this.constructor.name} for ${this.cronExpression}`);

		cron.schedule(this.cronExpression, () => {
			console.log(
				magenta(`[SHARD-SCHEDULE]`),
				blue(`[${new Date().toLocaleString()}] Running scheduled task ${this.constructor.name}...`),
			);
			void this.execute(this.manager);
		});
	}

	// @ts-expect-error 6133
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public execute(manager: ShardingManager): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
