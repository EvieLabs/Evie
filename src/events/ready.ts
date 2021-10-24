import { MessageEmbed } from "discord.js";

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const { axo } = require("../axologs");

    // Evie Doesn't Have time for you ;)

    client.user.setPresence({
      status: "dnd",
    });

    // Her sleeping function

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    // Bot  Playground warning

    // setInterval(() => {
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "**We strongly recommend you mute this channel! So you don't get pinged by others using commands on you!**"
    //     );
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "https://cdn.discordapp.com/attachments/885135206435151872/899155614700298330/IG7P2NlKjz.gif"
    //     );
    // }, 900000);
    // setInterval(() => {
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "For help on commands on `Tristan's Discord` Check out <#894819677136633856>"
    //     );
    // }, 600000);

    // Night night console!

    console.clear();

    // Login

    axo.startupMsg(`Ready! Logged in as ${client.user.tag}`);

    // Slashys

    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    require("dotenv").config();
    const token = process.env.CLIENT_TOKEN;
    const fs = require("fs");

    const Ecommands: string[] = [];
    const EcommandFiles = fs
      .readdirSync("./Ecommands")
      .filter((file) => file.endsWith(".js"));

    const commands: string[] = [];
    const none = [];
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    // Place your client and guild ids here
    const clientId = "807543126424158238";
    const betaid = "900875807969406987";
    const TSMP = "819106797028769844";
    const jambl = "807927235478421534";

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }

    for (const file of EcommandFiles) {
      const Ecommand = require(`../Ecommands/${file}`);
      Ecommands.push(Ecommand.data.toJSON());
    }

    const rest = new REST({ version: "9" }).setToken(token);

    (async () => {
      try {
        axo.startupMsg("Started refreshing application (/) commands.");

        // Reset all commands

        // await rest.put(
        //   // Routes.applicationGuildCommands(clientId, guildId),
        //   Routes.applicationGuildCommands(clientId, TSMP),
        //   // Routes.applicationCommands(clientId),
        //   { body: none }
        // );

        // Actually put commands

        await rest.put(
          // Routes.applicationGuildCommands(clientId, guildId),
          Routes.applicationGuildCommands(clientId, TSMP),
          // Routes.applicationCommands(clientId),
          { body: Ecommands }
        );

        await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });

        axo.startupMsg("Successfully reloaded application (/) commands.");
        axo.startupMsg("------------------------------------------------");
        axo.startupMsg('"Ready to do my job on Discord" -Evie by tristan');
        axo.startupMsg(
          "My current ping to Discord is " + client.ws.ping.toString()
        );
        axo.startupMsg("------------------------------------------------");
      } catch (error) {
        axo.err(error);
      }
    })();
  },
};
