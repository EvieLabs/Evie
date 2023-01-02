/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { config } from "dotenv";
config({ path: "../../.env" });

import { InfluxManager } from "#root/schedules/InfluxManager";
import { Environment } from "@teamevie/env";
import { blue, magenta } from "colorette";
import { EvieSharder } from "./lib/internal";

const manager = EvieSharder.getInstance();

manager.on("shardCreate", (shard) => console.log(magenta(`[${shard.id}]`), blue("Launched Shard")));

manager
	.spawn()
	.then(() => {
		if (Environment.getString("INFLUX_URL", true)) new InfluxManager("*/15 * * * * *", manager);
	})
	.catch(console.error);
