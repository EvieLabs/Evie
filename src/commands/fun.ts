import { SlashCommandBuilder } from "@discordjs/builders";
const getJSON = require("get-json");
import { embed } from "../tools";
const ms = require("ms");
import fetch from "node-fetch";
import {
  MessageEmbed,
  Channel,
  Interaction,
  CommandInteraction,
} from "discord.js";
import { axo } from "../axologs";
import { debuglog } from "util";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("fun")
    .setDescription("Fun Commands")
    .addSubcommand((subcommand) =>
      subcommand.setName("shiba").setDescription("much wow so cool very cute")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("evie")
        .setDescription("sends a picture of real life evie")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("goose").setDescription("honk!")
    ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "shiba") {
      const res = await fetch(
        `http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const respros = await res.json();

      const dog = respros[0];

      interaction.reply(dog.toString());
    } else if (subcommand == "evie") {
      async function randomEvie() {
        const res = await fetch(
          `https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/evie.txt`
        );
        const pics: string[] = (await res.text()).trim().split("\n");
        return pics[Math.floor(Math.random() * pics.length)];
      }
      interaction.reply(await randomEvie());
    } else if (subcommand == "goose") {
      const res = await fetch(`https://random-d.uk/api/v1/random`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const respros = await res.json();

      const goose = respros?.url;

      interaction.reply(goose.toString());
    }
  },
};
