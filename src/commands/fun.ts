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
module.exports = {
  data: new SlashCommandBuilder()
    .setName("fun")
    .setDescription("Fun Commands")
    .addSubcommand((subcommand) =>
      subcommand.setName("shiba").setDescription("much wow so cool very cute")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "shiba") {
      // using node fetch get https://api.phisherman.gg/v1/domains/{domain}

      const res = await fetch(
        `https://api.phisherman.gg/v1/domains/${domain}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      return json;
    }
  },
};
