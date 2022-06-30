import { blue, magenta } from "colorette";
import { ShardingManager } from "discord.js";

const manager = new ShardingManager(`${__dirname}/bot.js`, {
  token: process.env.CLIENT_TOKEN,
});

manager.on("shardCreate", (shard) =>
  console.log(magenta(`[${shard.id}]`), blue("Launched Shard"))
);

manager
  .spawn()
  .then((shards) => {
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
