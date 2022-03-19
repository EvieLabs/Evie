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

import { botAdmins } from "#root/utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Message, Permissions } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.MessageCreate,
})
export class MessageCreate extends Listener {
  public async run(message: Message) {
    if (message.author.bot || !message.inGuild()) return;

    message.client.phisherman.scan(message);
    message.client.blockedWords.scan(message);

    if (!message.guild.me) return;

    if (
      botAdmins.includes(message.author.id) &&
      message.content == "e!resetapp" &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      const status = await message.reply(
        "Resetting global application commands.."
      );
      await message.client.application?.commands.set([]);
      await status.edit("Resetting per guild commands...");
      message.client.guilds.cache.forEach(async (guild) => {
        console.log(`Resetting commands for ${guild.name}...`);
        await message.client.application?.commands
          .set([], guild.id)
          .catch(console.error);
        console.log(`Reset commands for ${guild.name}`);
      });
      await status.edit("Done!");
    }
  }
}
