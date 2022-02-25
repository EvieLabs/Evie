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

import { SlashCommandBuilder } from "@discordjs/builders";
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
