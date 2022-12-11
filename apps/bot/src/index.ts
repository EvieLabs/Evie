/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { config } from "dotenv";
config({ path: "../../.env" });

import { InfluxManager } from "#root/schedules/InfluxManager";
import { Environment } from "@evie/env";
import { blue, magenta } from "colorette";
import { EvieSharder } from "./lib/internal";

const manager = EvieSharder.getInstance();

manager.on("shardCreate", (shard) => console.log(magenta(`[${shard.id}]`), blue("Launched Shard")));

manager
	.spawn()
	.then((shards) => {
		if (Environment.getString("INFLUX_URL", true)) new InfluxManager("*/15 * * * * *", manager);

		shards.forEach((shard) => {
			shard.on("message", (message) => {
				console.log(magenta(`[${shard.id}]`), "📢", blue(message._eval ?? message._fetchProp));
			});
		});
	})
	.catch(console.error);
