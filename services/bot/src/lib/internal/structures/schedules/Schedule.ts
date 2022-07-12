import { container } from "@sapphire/framework";
import cron from "node-cron";

export class Schedule {
	public constructor(private readonly cronExpression: string) {
		container.logger.debug(`[SCHEDULE]: Loaded new schedule ${this.constructor.name} for ${this.cronExpression}`);
		cron.schedule(this.cronExpression, () => {
			container.logger.debug(
				`[SCHEDULE]: [${new Date().toLocaleString()}] Running scheduled task ${this.constructor.name}...`,
			);
			void this.execute();
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public execute() {
		throw new Error("Method not implemented.");
	}
}
