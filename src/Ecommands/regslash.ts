import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

const { axo } = require("../axologs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slashys")
    .setDescription("Reloads all slash commands!"),
  async execute(interaction) {
    const client = interaction.client;

    async function refreshCommands() {
      const { REST } = require("@discordjs/rest");
      const { Routes } = require("discord-api-types/v9");
      require("dotenv").config();
      const token = process.env.CLIENT_TOKEN;
      const fs = require("fs");

      const Ecommands: string[] = [];
      const EcommandFiles = fs
        .readdirSync("./Ecommands")
        .filter((file) => file.endsWith(".js"));

      const tsmpmenus: string[] = [];
      const tsmpmenusFiles = fs
        .readdirSync("./tsmpmenu")
        .filter((file) => file.endsWith(".js"));

      const menus: string[] = [];
      const menusFiles = fs
        .readdirSync("./ctxmenus")
        .filter((file) => file.endsWith(".js"));

      const commands: string[] = [];
      const none = [];
      const commandFiles = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));

      let clientId = "";
      const betaid = "900875807969406987";
      let TSMP = "819106797028769844";
      const jambl = "807927235478421534";

      // Place your client and guild ids here
      if (client.user.id == betaid) {
        axo.startupMsg("RUNNING IN BETA MODE");
        clientId = betaid;
        TSMP = "901426442242498650";
      } else {
        axo.startupMsg("RUNNING IN PROD MODE");
        clientId = "807543126424158238";
        TSMP = "819106797028769844";
      }

      for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
      }

      for (const file of EcommandFiles) {
        const Ecommand = require(`../Ecommands/${file}`);
        Ecommands.push(Ecommand.data.toJSON());
      }

      for (const file of menusFiles) {
        const menu = require(`../ctxmenus/${file}`);
        commands.push(menu.data);
      }

      for (const file of tsmpmenusFiles) {
        const tsmpmenu = require(`../tsmpmenu/${file}`);
        Ecommands.push(tsmpmenu.data);
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
    }

    if (interaction.user.toString() == "<@97470053615673344>") {
      refreshCommands();
      interaction.reply("Refreshing!");
    } else {
      await interaction.reply({
        content: "Hey! Your not one of my Devs!",
        ephemeral: true,
      });
    }
  },
};
