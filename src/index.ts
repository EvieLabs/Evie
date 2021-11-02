// require the needed discord.js classes
const { Client, Intents, Collection, Permissions } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const DisTube = require("distube").default;
const voice = require("@discordjs/voice");
const ffmpeg = require("ffmpeg-static");
import * as config from "./botconfig/emojis.json";
import * as config3 from "./botconfig/filters.json";
import * as config2 from "./botconfig/embed.json";
import * as config4 from "./botconfig/settings.json";

const DBD = require("discord-dashboard");
const CaprihamTheme = require("../dbd-capriham-theme");

let langsSettings = {};

let currencyNames = {};

let botNicknames = {};

export function getLang() {
  return langsSettings;
}

// create a new Discord client

const client = new Client(
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

// Dashboard
const Dashboard = new DBD.Dashboard({
  port: 80,
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  },
  invite: {
    redirectUri: "http://localhost/manage/",
    permissions: "518855707712",
    scopes: ["bot", "applications.commands", "identify"],
  },
  redirectUri: "http://localhost/discord/callback",
  domain: "http://localhost",
  bot: client,
  theme: CaprihamTheme({
    websiteName: "Evie✨",
    iconURL: "https://eviebot.rocks/assets/EvieHead.svg",
    index: {
      card: {
        title: "Evie✨",
        description:
          "Evie is a public moderation/music/fun/economy/utility bot for Discord, designed with modern Discord features like slash commands.",
        image: "https://i.imgur.com/htBQda9.gif",
      },
      information: {
        title: "Information",
        description:
          "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>.<br><br><b><i>You can use HTML there</i></b>",
      },
      feeds: {
        title: "Feeds",
        list: [
          {
            icon: "fa fa-user",
            text: "New user registered",
            timeText: "Just now",
            bg: "bg-light-info",
          },
          {
            icon: "fa fa-server",
            text: "Server issues",
            timeText: "3 minutes ago",
            bg: "bg-light-danger",
          },
        ],
      },
    },
  }),
  settings: [
    {
      categoryId: "setup",
      categoryName: "Setup",
      categoryDescription: "Setup your bot with default settings!",
      categoryOptionsList: [
        {
          optionId: "lang",
          optionName: "Language",
          optionDescription: "Change bot's language easily",
          optionType: DBD.formTypes.select({
            Polish: "pl",
            English: "en",
            French: "fr",
          }),
          getActualSet: async ({ guild }) => {
            return langsSettings[guild.id] || null;
          },
          setNew: async ({ guild, newData }) => {
            langsSettings[guild.id] = newData;
            return;
          },
        },
        {
          optionId: "nickname",
          optionName: "Nickname",
          optionDescription: "Bot's nickname on the guild",
          optionType: DBD.formTypes.input("Bot username", 1, 16, false, true),
          getActualSet: async ({ guild }) => {
            return botNicknames[guild.id] || false;
          },
          setNew: async ({ guild, newData }) => {
            botNicknames[guild.id] = newData;
            return;
          },
        },
      ],
    },
    {
      categoryId: "eco",
      categoryName: "Economy",
      categoryDescription: "Economy Module Settings",
      categoryOptionsList: [
        {
          optionId: "currency_name",
          optionName: "Currency name",
          optionDescription: "Economy module Guild currency name",
          optionType: DBD.formTypes.input(
            "Currency name",
            null,
            10,
            false,
            true
          ),
          getActualSet: async ({ guild }) => {
            return currencyNames[guild.id] || null;
          },
          setNew: async ({ guild, newData }) => {
            currencyNames[guild.id] = newData;
            return;
          },
        },
      ],
    },
  ],
});

Dashboard.init();

// discord-music-player

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
client.distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: false,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  // youtubeCookie: config.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie
  // nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  //  customFilters: filters,
  plugins: [
    //new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin(),
  ],
});

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
        `your feedback in https://discord.gg/jfmXDxtN3U`,
        `you hopefully running /vote`,
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

// Error Message for Commands
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
          "Something went wrong! Please alert this to staff in <#884223699778150400>",
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
          "Something went wrong! Please alert this to staff in <#884223699778150400> on https://discord.gg/SQhdgXV3rh",
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

client.login(process.env.CLIENT_TOKEN);
