import { config } from "dotenv";
import moduleAlias from "module-alias";
moduleAlias(__dirname + "../../package.json");
config({ path: "../../.env" });

import { InfluxManager } from "#root/schedules/InfluxManager";
import { blue, magenta } from "colorette";
import { EvieSharder } from "./lib/internal";

const manager = EvieSharder.getInstance();

manager.on("shardCreate", (shard) =>
  console.log(magenta(`[${shard.id}]`), blue("Launched Shard"))
);

manager
  .spawn()
  .then((shards) => {
    if (process.env.INFLUX_URL) new InfluxManager("*/15 * * * * *", manager);

    shards.forEach((shard) => {
      shard.on("message", (message) => {
        console.log(
          magenta(`[${shard.id}]`),
          "📢",
          blue(message._eval ?? message._fetchProp)
        );
      });
    });
  })
  .catch(console.error);
