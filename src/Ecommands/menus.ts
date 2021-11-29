import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";
import { Routes } from "discord-api-types/v9";

const { axo } = require("../axologs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menus")
    .setDescription("Reloads all ctx menus!"),
  async execute(interaction) {
    const client = interaction.client;

    async function refreshCommands() {
      const { REST } = require("@discordjs/rest");

      require("dotenv").config();
      const token = process.env.CLIENT_TOKEN;
      const fs = require("fs");

      const tsmpmenus: string[] = [];
      const tsmpmenuFiles = fs
        .readdirSync("./tsmpmenu")
        .filter((file) => file.endsWith(".js"));

      const ctxmenus: string[] = [];
      const none = [];
      const ctxmenusFiles = fs
        .readdirSync("./ctxmenus")
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

      for (const file of ctxmenus) {
        const command = require(`../ctxmenus/${file}`);
        ctxmenus.push(command.data);
      }

      for (const file of tsmpmenuFiles) {
        const tsmpmenu = require(`../tsmpmenu/${file}`);
        tsmpmenus.push(tsmpmenu.data);
      }

      const rest = new REST({ version: "9" }).setToken(token);

      (async () => {
        try {
          axo.startupMsg(
            "Started refreshing application (Context Menu) commands."
          );

          await rest.put(
            // Routes.applicationGuildCommands(clientId, guildId),
            Routes.applicationGuildCommands(clientId, TSMP),
            // Routes.applicationCommands(clientId),
            { body: tsmpmenus }
          );

          await rest.put(Routes.applicationCommands(clientId), {
            body: ctxmenus,
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
