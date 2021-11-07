// require the needed discord.js classes
const { Client, Intents, Collection, Permissions } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const DisTube = require("distube").default;
const voice = require("@discordjs/voice");
const ffmpeg = require("ffmpeg-static");
const mongoose = require("mongoose");
import * as evie from "./tools";
import * as config from "./botconfig/emojis.json";
import * as config3 from "./botconfig/filters.json";
import * as config2 from "./botconfig/embed.json";
import * as config4 from "./botconfig/settings.json";

const DBD = require("discord-dashboard");
const Evie = require("../eviebot");

let langsSettings = {};

let currencyNames = {};

let botNicknames = {};

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
  serverid: String,
  color: String,
  bannedWordList: String,
  defaultBannedWordList: Boolean,
  welcomeMessage: String,
  welcomeMessageEnabled: Boolean,
  welcomeChannel: String,
});

export const eModel = mongoose.model("guildSettings", embedColour);

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
  theme: Evie({
    websiteName: "Evie✨",
    iconURL: "https://eviebot.rocks/assets/EvieHead.svg",
  }),
  settings: [
    {
      categoryId: "setup",
      categoryName: "Setup",
      categoryDescription: "Change Evie's configuration for your server",
      categoryOptionsList: [
        {
          optionId: "embedcolor",
          optionName: "Embed Colour",
          optionDescription:
            "Change what colour Evie uses for embeds in your server",
          optionType: DBD.formTypes.colorSelect(),
          getActualSet: async ({ guild }) => {
            return (await evie.getEC(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                color: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
            return;
          },
        },
        {
          optionId: "nickname",
          optionName: "Nickname",
          optionDescription:
            "Change Evie's Nickname on your server! (personally evie likes her own name fyi)",
          optionType: DBD.formTypes.input("Evie", 1, 16, false, true),
          getActualSet: async ({ guild }) => {
            try {
              const nick = guild.me.nickname;
              return nick || false;
            } catch (error) {
              return "Evie✨" || false;
            }
          },
          setNew: async ({ guild, newData }) => {
            if (newData.toString()) {
              const actualGuild = await client.guilds.cache.get(guild.id);
              await actualGuild.members
                .fetch()
                .then((data) =>
                  actualGuild.me.setNickname(
                    "",
                    "Changed my nickname due to an admin changing it via the Dashboard"
                  )
                )
                .catch((error) => console.log(error));
              return;
            } else {
              const actualGuild = await client.guilds.cache.get(guild.id);
              await actualGuild.members
                .fetch()
                .then((data) =>
                  actualGuild.me.setNickname(
                    newData.toString(),
                    "Changed my nickname due to an admin changing it via the Dashboard"
                  )
                )
                .catch((error) => console.log(error));
              return;
            }
          },
        },
      ],
    },
    {
      categoryId: "mod",
      categoryName: "Moderation",
      categoryDescription: "Evie's Moderation Settings",
      categoryOptionsList: [
        {
          optionId: "banwordlist",
          optionName: "Banned Words",
          optionDescription:
            "Words here will automatically get deleted and I'll let them know not to do it again! (format them in a comma separated list like; swearword1,swearword2)",
          optionType: DBD.formTypes.textarea(
            "this,is,an,example,of,some,words"
          ),
          getActualSet: async ({ guild }) => {
            return (await evie.getBL(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                bannedWordList: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
            return;
          },
        },
        {
          optionId: "defaultswear",
          optionName: "Use Default Banned Word List",
          optionDescription:
            "Enable this to use the Default Banned word list with your banned word list",
          optionType: DBD.formTypes.switch(true),
          getActualSet: async ({ guild }) => {
            return (await evie.getDBL(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                defaultBannedWordList: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
            return;
          },
        },
      ],
    },
    {
      categoryId: "welcome",
      categoryName: "Welcomer",
      categoryDescription: "Evie's Welcomer Settings",
      categoryOptionsList: [
        {
          optionId: "enablewelcomer",
          optionName: "Enable Evie's Welcomer Module",
          optionDescription: "",
          optionType: DBD.formTypes.switch(true),
          getActualSet: async ({ guild }) => {
            return (await evie.getWelcomeModuleSwitch(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                welcomeMessageEnabled: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
            return;
          },
        },
        {
          optionId: "welcomemsg",
          optionName: "Welcome Message",
          optionDescription:
            "What to say when someone joins, for a full list of codes such as ${mentionUser} you can visit the short code wiki https://docs.eviebot.rocks/dashboard/shortcodes",
          optionType: DBD.formTypes.textarea(
            "Welcome ${mentionUser}! to our amazing server!"
          ),
          getActualSet: async ({ guild }) => {
            return (await evie.getWelcomeMessage(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                welcomeMessage: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
            return;
          },
        },
        {
          optionId: "welcomechannel",
          optionName: "Welcome Channel",
          optionDescription: "What channel do I say the message in",
          optionType: DBD.formTypes.channelsSelect(),
          getActualSet: async ({ guild }) => {
            return (await evie.getWelcomeChannel(guild)) || false;
          },
          setNew: async ({ guild, newData }) => {
            await eModel.findOneAndUpdate(
              {
                serverid: guild.id,
              },
              {
                welcomeChannel: newData,
              },
              {
                upsert: true,
                new: true,
              }
            );
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
        `/help`
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

client.login(process.env.CLIENT_TOKEN);
