/* 
Copyright 2022 Tristan Camejo

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

// declare module "discord.js" {
//   interface Client {
//     commands: Collection<string, EvieCommand>;
//     Ecommands: Collection<string, EvieCommand>;
//     tsmpmenus: Collection<string, EvieContextMenu>;
//     menus: Collection<string, EvieContextMenu>;
//   }
// }

// client.commands = new Collection();
// client.Ecommands = new Collection();
// client.tsmpmenus = new Collection();
// client.menus = new Collection();
// const eventFiles = fs
//   .readdirSync("./events")
//   .filter((file: string) => file.endsWith(".js"));

// // Load Events

// for (const file of eventFiles) {
//   const event = require(`./events/${file}`);
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args));
//   } else {
//     client.on(event.name, (...args) => event.execute(...args));
//   }
// }

// Status

client.once("ready", () => {
  if (client.user == null) {
    throw new Error("Client user is null");
  }

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

// // CTX Menu Handler
// client.on("interactionCreate", async (interaction: Interaction) => {
//   if (!interaction.isContextMenu()) return;
//   if (client.menus.get(interaction.commandName)) {
//     const command = client.menus.get(interaction.commandName);

//     if (!command) return;

//     try {
//       await command.execute(interaction);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({
//         content:
//           "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
//         ephemeral: true,
//       });
//     }
//   } else {
//     const command = client.tsmpmenus.get(interaction.commandName);

//     if (!command) return;
//     try {
//       await command.execute(interaction);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({
//         content:
//           "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
//         ephemeral: true,
//       });
//     }
//   }
// });

// // Slash Command Handler
// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;

//   if (client.commands.get(interaction.commandName)) {
//     const command = client.commands.get(interaction.commandName);

//     if (!command) return;

//     try {
//       await command.execute(interaction);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({
//         content:
//           "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
//         ephemeral: true,
//       });
//     }
//   } else {
//     const command = client.Ecommands.get(interaction.commandName);

//     if (!command) return;

//     try {
//       await command.execute(interaction);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({
//         content:
//           "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
//         ephemeral: true,
//       });
//     }
//   }
// });

// // Load Commands

// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file: string) => file.endsWith(".js"));

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   // set a new item in the Collection
//   // with the key as the command name and the value as the exported module
//   client.commands.set(command.data.name, command);
// }

// const EcommandFiles = fs
//   .readdirSync("./Ecommands")
//   .filter((file: string) => file.endsWith(".js"));

// for (const file of EcommandFiles) {
//   const Ecommand = require(`./Ecommands/${file}`);
//   // set a new item in the Collection
//   // with the key as the command name and the value as the exported module
//   client.Ecommands.set(Ecommand.data.name, Ecommand);
// }

// // Load Context Menus

// const ctxmenus = fs
//   .readdirSync("./ctxmenus")
//   .filter((file: string) => file.endsWith(".js"));

// for (const file of ctxmenus) {
//   const ctxmenu = require(`./ctxmenus/${file}`);
//   // set a new item in the Collection
//   // with the key as the command name and the value as the exported module
//   client.menus.set(ctxmenu.data.name, ctxmenu);
// }

// const tsmpmenu = fs
//   .readdirSync("./tsmpmenu")
//   .filter((file: string) => file.endsWith(".js"));

// for (const file of tsmpmenu) {
//   const tsmpmenu = require(`./tsmpmenu/${file}`);
//   // set a new item in the Collection
//   // with the key as the command name and the value as the exported module
//   client.tsmpmenus.set(tsmpmenu.data.name, tsmpmenu);
// }

/** Login to the client */
await client.login(process.env.CLIENT_TOKEN);
