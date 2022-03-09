// import { redis } from "#root/utils/database";
// import { ApplyOptions } from "@sapphire/decorators";
// import { Listener } from "@sapphire/framework";
// import type { Message } from "discord.js";

// @ApplyOptions<Listener.Options>({ once: false, event: "messageCreate" })
// export class MessageListener extends Listener {
//   public async run(m: Message) {
//     if (m.content != "e!redis_debug") return;

//     m.reply(`Redis Keys:
//     \`\`\`
//     ${await redis.keys("*")}
//     \`\`\``);
//   }
// }
