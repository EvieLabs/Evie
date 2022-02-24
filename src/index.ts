// require the needed discord.js classes
const { Client, Intents, Collection, Permissions } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
import { Interaction } from "discord.js";
const mongoose = require("mongoose");
import * as evie from "./tools";
import * as config from "./botconfig/emojis.json";
import * as config2 from "./botconfig/embed.json";
import * as config3 from "./botconfig/filters.json";
import * as config4 from "./botconfig/settings.json";

let langsSettings = {};

export function getLang() {
  return langsSettings;
}

// create a new Discord client

export const client = new Client(
  {
    intents: [
      Intents.FLAGS.GUILDS,
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  },
  { shardCount: "auto" }
);
client.tristan = "Hey, This is a test!";
client.allEmojis = require("./botconfig/emojis.json");
client.commands = new Collection();
client.Ecommands = new Collection();
client.tsmpmenus = new Collection();
client.menus = new Collection();
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

// Load Events

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Databases

mongoose.connect(
  "mongodb+srv://evie:IHgatYyirF8IIuJs@cluster0.dobcl.mongodb.net/evie"
);

const Schema = mongoose.Schema;

const embedColour = new Schema({
  // server id
  serverid: String,
  // embed custom colour
  color: String,
  // banned words
  bannedWordList: String,
  defaultBannedWordList: Boolean,
  // welcome message
  welcomeMessage: String,
  welcomeMessageEnabled: Boolean,
  welcomeChannel: String,
  welcomeMessagePingEnabled: Boolean,
  // goodbye message
  goodbyeMessage: String,
  goodbyeMessageEnabled: Boolean,
  goodbyeChannel: String,
  // phishing detection
  phishingDetectionEnabled: Boolean,
  // Join Role
  joinRoleID: String,
  joinRoleEnabled: Boolean,
});

export const eModel = mongoose.model("guildSettings", embedColour);

// Money

const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
CurrencySystem.cs.on("debug", (debug, error) => {
  console.log(debug);
  if (error) console.error(error);
});

// Status

client.once("ready", () => {
  try {
    setInterval(() => {
      const activities_list = [
        `your slash commands`,
        `eviebot.rocks`,
        `/help`,
        //``
      ];
      const index = Math.floor(
        Math.random() * (activities_list.length - 1) + 1
      );
      client.user.setActivity(activities_list[index], { type: "LISTENING" });
    }, 50000); //Timer
  } catch (error) {
    console.log(error);
  }
});

cs.setMongoURL(
  "mongodb+srv://evie:IHgatYyirF8IIuJs@cluster0.dobcl.mongodb.net/mongoeconomy"
);
//sets default wallet amount when ever new user is created.
cs.setDefaultWalletAmount(1000);
//sets default bank amount when ever new user is created.
cs.setDefaultBankAmount(0);

// CTX Menu Handler
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isContextMenu()) return;
  if (client.menus.get(interaction.commandName)) {
    const command = client.menus.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
        ephemeral: true,
      });
    }
  } else {
    const command = client.tsmpmenus.get(interaction.commandName);

    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
        ephemeral: true,
      });
    }
  }
});

// Slash Command Handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (client.commands.get(interaction.commandName)) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
        ephemeral: true,
      });
    }
  } else {
    const command = client.Ecommands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Something went wrong! Please alert this to staff in https://discord.gg/82Crd8tZRF",
        ephemeral: true,
      });
    }
  }
});

// Load Commands

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

const EcommandFiles = fs
  .readdirSync("./Ecommands")
  .filter((file) => file.endsWith(".js"));

for (const file of EcommandFiles) {
  const Ecommand = require(`./Ecommands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.Ecommands.set(Ecommand.data.name, Ecommand);
}

// Load Context Menus

const ctxmenus = fs
  .readdirSync("./ctxmenus")
  .filter((file) => file.endsWith(".js"));

for (const file of ctxmenus) {
  const ctxmenu = require(`./ctxmenus/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.menus.set(ctxmenu.data.name, ctxmenu);
}

const tsmpmenu = fs
  .readdirSync("./tsmpmenu")
  .filter((file) => file.endsWith(".js"));

for (const file of tsmpmenu) {
  const tsmpmenu = require(`./tsmpmenu/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.tsmpmenus.set(tsmpmenu.data.name, tsmpmenu);
}

client.login(process.env.CLIENT_TOKEN);
