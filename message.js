// require the needed discord.js classes
const { Client, Intents, Collection } = require("discord.js");
require("dotenv").config();

// Create a new Player (you don't need any API Key)

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

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (msg) => {
  try {
    if (msg.content.startsWith("j!")) {
      msg.reply(
        "Jamble is Upgrading soon! Please read the info here https://discord.gg/sakraSRbqX"
      );
      console.log("JUST SAID MY MESSAGE!");
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(`ODA3NTQzMTI2NDI0MTU4MjM4.YB5hJA.4l2lUQmygeKQFxd9WCrcWVgODmQ`);
