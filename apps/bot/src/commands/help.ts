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
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Need help with me?")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("commands")
        .setDescription("Need help with my commands?")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("config").setDescription("Need help configurating me?")
    ),
  async execute(interaction) {
    const exampleEmbed = await embed(interaction.guild);
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "commands":
        try {
          exampleEmbed.setDescription(
            `Hey, do you need help with my commands? If so you can find a list by doing this, if you need even more help you can read more info [here](https://discord.gg/82Crd8tZRF) and also talk to our staff!`
          );
          exampleEmbed.setImage(
            `https://cdn.discordapp.com/attachments/885135206435151872/903570072675692555/RqivnDqPvH.gif`
          );
          interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
        } catch (error) {
          console.log(error);
        }
      case "config":
        try {
          exampleEmbed.setDescription(
            `Hey, you can configure all my settings such as banned words, changing my embed colours, welcoming new people and more now via the [online dashboard](https://dash.eviebot.rocks/discord), if you need more help you can ask us [on our support server](https://discord.gg/82Crd8tZRF)!`
          );
          interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
        } catch (error) {
          console.log(error);
        }
    }
  },
};
