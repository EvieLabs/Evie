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

import "dotenv/config";
import { Intents } from "discord.js";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import "@sapphire/plugin-logger/register";
import discordModals from "discord-modals";

/** The Sapphire Client */
export const client = new SapphireClient({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  logger: {
    level: LogLevel.Info,
  },
  loadMessageCommandListeners: true,
});

client.fetchPrefix = () => "slashies.";

// @ts-ignore
discordModals(client);

client.once("ready", () => {
  if (client.user == null) {
    throw new Error("Client user is null");
  }
  console.log(process.env.GUILD_IDS ? process.env.GUILD_IDS.split(",") : []);
  try {
    setInterval(() => {
      const activities_list = [`your slash commands`, `eviebot.rocks`, `/help`];
      const index = Math.floor(
        Math.random() * (activities_list.length - 1) + 1
      );
      client.user!.setActivity(activities_list[index], { type: "LISTENING" });
    }, 50000);
  } catch (error) {
    console.log(error);
  }
});

/** Login to the client */
await client.login(process.env.CLIENT_TOKEN);
