import { config } from "dotenv";
import moduleAlias from "module-alias";
moduleAlias(__dirname + "../../package.json");
config({ path: "../../.env" });

import { InfluxManager } from "#root/schedules/InfluxManager";
import { blue, magenta } from "colorette";
import { ShardingManager } from "discord.js";

class ShardManager extends ShardingManager {
  override async fetchMergeClientValues(prop: string): Promise<unknown> {
    try {
      const values = await this.fetchClientValues(prop);

      const value = values.reduce((acc, value) => {
        switch (typeof value) {
          case "number":
            switch (typeof acc) {
              case "number":
                return acc + value;
              default:
                throw new Error(`not a number: ${typeof acc}`);
            }
          default:
            throw new Error(`not a number: ${typeof value}`);
        }
      }, 0);

      return value as number;
    } catch (error) {
      throw error;
    }
  }
}

const manager = new ShardManager(`${__dirname}/bot.js`, {
  token: process.env.CLIENT_TOKEN,
});

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

declare module "discord.js" {
  interface ShardingManager {
    fetchMergeClientValues(prop: string): Promise<unknown>;
  }
}
