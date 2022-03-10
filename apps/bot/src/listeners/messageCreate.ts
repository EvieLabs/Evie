/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
