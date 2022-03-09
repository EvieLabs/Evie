/* 
Copyright 2022 Team Evie

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

import axios from "axios";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EvieEmbed } from "#classes/EvieEmbed";
const ms = require("ms");
import * as Hypixel from "hypixel-api-reborn";
import util from "minecraft-server-util";
import type { CommandInteraction, User } from "discord.js";
const imgur = require("imgur");
import { axo } from "#root/axologs";
import fetch from "node-fetch";
import type { DiscordLookupRes, McMMORes } from "#types/api/TSMP";

const hypixel = new Hypixel.Client(process.env.HYPIXEL!);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Minecraft Related Commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("serverstats")
        .setDescription("Replies with Minecraft Server Stats!")
        .addStringOption((option) =>
          option
            .setName("ip")
            .setDescription(
              "Minecraft Java Server Address (If empty it will pull up TristanSMP Info"
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hypixel")
        .setDescription("Pull up player stats on Hypixel")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("Username of the player you want to query")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tristansmp")
        .setDescription("Pull up player stats on TristanSMP")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("Username of the player you want to query")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "serverstats") {
      let realInput: string =
        (await interaction.options.getString("ip")) ?? "tristansmp.com";

      util
        .status(realInput) // port is default 25565
        .then((response) => {
          interaction.deferReply();
          let data = response.favicon; // your image data
          const base64Data = data!.replace(/^data:image\/png;base64,/, "");
          imgur
            .uploadBase64(base64Data)
            .then(async (json: any) => {
              axo.log("[SERVER STATS CACHE] " + json.link);
              const serverIconLink = json.link;
              let exampleEmbed = await EvieEmbed(interaction.guild);
              exampleEmbed
                .setColor("#0099ff")
                .setTitle("Server Stats")
                .setDescription("**Server Address**: " + "`" + realInput + "`")
                .addFields(
                  {
                    name: "Online Players",
                    value:
                      response.onlinePlayers!.toString() +
                      "/" +
                      response.maxPlayers!.toString(),
                  },
                  {
                    name: "Motd",
                    value:
                      "```" +
                      response.description!.descriptionText.toString() +
                      "```",
                  },
                  {
                    name: "Server Version",
                    value: "```" + response.version + "```",
                  },
                  {
                    name: "Server Icon",
                    value: ":point_down:",
                  }
                )
                .setImage(serverIconLink)
                .setTimestamp();

              interaction.editReply({
                embeds: [exampleEmbed],
              });
            })
            .catch((error: any) => {
              axo.err(error.message);
            });
        })
        .catch((err) => {
          axo.err(err.message);
        });
    }
    if (subcommand == "tristansmp") {
      await interaction.deferReply();
      const url =
        "http://202.131.88.29:25571/player/" +
        interaction.options.getString("username") +
        "/raw";
      try {
        axios.get(url).then(async (r) => {
          const response = r.data;
          const username = interaction.options.getString("username");

          const uuid: string = response.BASE_USER.uuid;
          const faceUrl = "https://crafatar.com/renders/body/" + uuid;
          const skinDL = "https://crafatar.com/skins/" + uuid;

          const res: McMMORes = await fetch(
            `https://api.tristansmp.com/players/uuid/${response.uuid}/mcmmo`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((res) => res.json());

          const dres: DiscordLookupRes = await fetch(
            `https://api.tristansmp.com/players/username/${username}/discord`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((dres) => dres.json());

          if (!dres.error) {
          }
          const dUser: User | false = dres.error
            ? false
            : await interaction.client.users.fetch(dres.discordId);

          if (res.error) {
            return interaction.editReply({
              content: "Player needs to at least level up their skills once.",
            });
          }

          const applySkin =
            "https://www.minecraft.net/profile/skin/remote?url=" +
            skinDL +
            ".png&model=slim";

          const e = await EvieEmbed(interaction.guild);

          e.setDescription(
            `TSMP Stats for **${username}**${dUser ? ` | ${dUser}` : ""}`
          )
            .addFields(
              {
                name: "Play Time",
                value:
                  ms(response.world_times.times.world.times.SURVIVAL, {
                    long: true,
                  }) ?? "Missing",
                inline: true,
              },
              {
                name: "Power Level",
                value: res.powerLevel.toString() ?? "0",
                inline: true,
              },
              {
                name: "First Time Joining tristansmp.com",
                value: response.BASE_USER.registered
                  ? `<t:${Math.trunc(response.BASE_USER.registered / 1000)}:R>`
                  : "Missing",
                inline: true,
              },
              {
                name: "Deaths",
                value: response.death_count.toString() ?? "0",
                inline: true,
              },
              {
                name: "Repair",
                value: res.repair.toString() ?? "0",
                inline: true,
              },
              {
                name: "Fishing",
                value: res.fishing.toString() ?? "0",
                inline: true,
              },
              {
                name: "Axes",
                value: res.axes.toString() ?? "0",
                inline: true,
              },
              {
                name: "Swords",
                value: res.swords.toString() ?? "0",
                inline: true,
              },
              {
                name: "Archery",
                value: res.archery.toString() ?? "0",
                inline: true,
              },
              {
                name: "Taming",
                value: res.taming.toString() ?? "0",
                inline: true,
              },
              {
                name: "Unarmed",
                value: res.unarmed.toString() ?? "0",
                inline: true,
              },
              {
                name: "Woodcutting",
                value: res.woodcutting.toString() ?? "0",
                inline: true,
              },
              {
                name: "Mining",
                value: res.mining.toString() ?? "0",
                inline: true,
              },
              {
                name: "Alchemy",
                value: res.alchemy.toString() ?? "0",
                inline: true,
              },
              {
                name: "Acrobatics",
                value: res.acrobatics.toString() ?? "0",
                inline: true,
              },
              {
                name: "Excavation",
                value: res.excavation.toString() ?? "0",
                inline: true,
              },
              {
                name: "Times Kicked",
                value: response.BASE_USER.timesKicked.toString() ?? "0",
                inline: true,
              },
              {
                name: "Skin",
                value:
                  "[Download](" +
                  skinDL +
                  ")" +
                  " | " +
                  "[Apply Skin](" +
                  applySkin +
                  ")",
                inline: true,
              }
            )
            .setThumbnail(faceUrl)
            .setTimestamp();
          interaction.editReply({ embeds: [e] });
        });
      } catch (err) {
        interaction.editReply("Failed fetching data");
      }
    }
    if (subcommand == "hypixel") {
      let pembed = await EvieEmbed(interaction.guild);
      let i: CommandInteraction = interaction;
      hypixel
        .getPlayer(i.options.getString("username") ?? "twisttaan")
        .then(async (player) => {
          // Title
          pembed.setTitle(`Hypixel Stats for ${player.nickname}`);
          // Thumbnail
          pembed.setThumbnail(
            `https://crafatar.com/renders/body/${player.uuid}`
          );
          // Stats
          pembed.addField("Player Level", player.level.toString());
          pembed.addField("Player Rank", player.rank, true);
          pembed.addField(
            "First Login",
            player.firstLogin.toLocaleDateString(),
            true
          );
          pembed.addField(
            "Bedwars Final Kills",
            player.stats?.bedwars?.finalKills.toString() ?? "None",
            true
          );
          pembed.addField(
            "Bedwars Kills",
            player.stats?.bedwars?.kills.toString() ?? "None",
            true
          );
          pembed.addField(
            "Bedwars KD",
            player.stats?.bedwars?.KDRatio.toString() ?? "None",
            true
          );
          pembed.addField(
            "Bedwars Wins",
            player.stats?.bedwars?.wins.toString() ?? "None",
            true
          );
          pembed.addField(
            "Bedwars Current Winstreak",
            player.stats?.bedwars?.winstreak.toString() ?? "None",
            true
          );
          pembed.addField(
            "Duels Wins",
            player.stats?.duels?.wins.toString() ?? "None",
            true
          );
          pembed.addField(
            "Skywars KD",
            player.stats?.skywars?.KDRatio.toString() ?? "None",
            true
          );
          pembed.addField(
            "Skywars Kills",
            player.stats?.skywars?.kills.toString() ?? "None",
            true
          );
          pembed.addField(
            "Skywars Wins",
            player.stats?.skywars?.wins.toString() ?? "None",
            true
          );
          pembed.addField(
            "Skywars Current Winstreak",
            player.stats?.skywars?.winstreak.toString() ?? "None",
            true
          );
          i.reply({ embeds: [pembed] });
        })

        .catch(async (e) => {
          console.error(e);
          const er = await EvieEmbed(interaction.guild!);
          er.setDescription(`Error: That player doesn't seem to exist`);
          i.reply({
            embeds: [er],
          });
        });
    }
  },
};
