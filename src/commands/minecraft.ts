import { SlashCommandBuilder } from "@discordjs/builders";
const getJSON = require("get-json");
import { embed } from "../tools";
const ms = require("ms");
import * as Hypixel from "hypixel-api-reborn";
import util from "minecraft-server-util";
import * as evie from "../tools";
import { CommandInteraction } from "discord.js";
import imgur from "imgur";
import { axo } from "../axologs";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HYPIXEL: string;
    }
  }
}
const hypixel = new Hypixel.Client(process.env.HYPIXEL);
var serverIconLink = null;
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
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "serverstats") {
      let realInput: string =
        (await interaction.options.getString("ip")) ?? "tristansmp.com";

      util
        .status(realInput) // port is default 25565
        .then((response) => {
          interaction.deferReply();
          let data = response.favicon; // your image data
          var base64Data = data!.replace(/^data:image\/png;base64,/, "");
          imgur
            .uploadBase64(base64Data)
            .then(async (json) => {
              axo.log("[SERVER STATS CACHE] " + json.link);
              const serverIconLink = json.link;
              let exampleEmbed = await embed(interaction.guild);
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
            .catch((error) => {
              axo.err(error.message);
            });
        })
        .catch((err) => {
          axo.err(err.message);
        });
    }
    if (subcommand == "tristansmp") {
      await interaction.reply(
        "<a:loading:877782934696919040> Fetching Info `(This will hang if " +
          interaction.options.getString("username") +
          " hasn't visited the End and the Nether and died atleast once)`"
      );
      var url =
        "http://202.131.88.29:25571/player/" +
        interaction.options.getString("username") +
        "/raw";

      try {
        getJSON(url, async function (error, response) {
          var username = interaction.options.getString("username");
          var url = "http://202.131.88.29:25571/player/" + username + "/raw";
          var uuid = "ec4b0c12-484e-4544-8346-cc1f1bdd10df";
          var whyjavalol = "com.djrapitops.plan.gathering.domain.WorldTimes";

          var currentChannel = interaction.currentChannel;

          if (error === null) {
            axo.log("Fetched JSON for " + username);
          } else {
            axo.err("[Player Stats, Get JSON] " + error);
          }

          //SKIN STUFF HERE

          if (response.BASE_USER === "undefined") {
            throw "DBNOEXIST";
          }
          if (response.world_times.times.world.times.SURVIVAL === "undefined") {
            throw "DIM";
          }
          if (
            response.world_times.times.world_nether.times.SURVIVAL ===
            "undefined"
          ) {
            throw "DIM";
          }
          if (
            response.world_times.times.world_the_end.times.SURVIVAL ===
            "undefined"
          ) {
            throw "DIM";
          }
          if (response.death_count === "undefined") {
            throw "DIE";
          }

          var uuid: string = response.BASE_USER.uuid;
          var faceUrl = "https://crafatar.com/renders/body/" + uuid;

          var skinDL = "https://crafatar.com/skins/" + uuid;

          var applySkin =
            "https://www.minecraft.net/profile/skin/remote?url=" +
            skinDL +
            ".png&model=slim";

          let firstDate = "Couldn't Find Data";
          const unixTime = new Date(response.BASE_USER.registered);

          firstDate = unixTime.toUTCString();

          // interaction.reply(response.url);
          let exampleEmbed = await embed(interaction.guild);
          exampleEmbed
            .setTitle("Player Stats on TristanSMP for " + username)
            .setDescription(
              "Hey, " +
                interaction.user.toString() +
                " heres a list of stats for " +
                username
            )
            .addFields(
              {
                name: "Play Time",
                value:
                  "Overworld: " +
                  "```" +
                  ms(response.world_times.times.world.times.SURVIVAL, {
                    long: true,
                  }) +
                  "```" +
                  "Nether: " +
                  "```" +
                  ms(response.world_times.times.world_nether.times.SURVIVAL, {
                    long: true,
                  }) +
                  "```" +
                  "End: " +
                  "```" +
                  ms(response.world_times.times.world_the_end.times.SURVIVAL, {
                    long: true,
                  }) +
                  "```",
              },
              {
                name: "Times Kicked",
                value: "```" + response.BASE_USER.timesKicked + "```",
              },
              {
                name: "First Time Joining tristansmp.com",
                value: "```" + firstDate + "```",
              },
              {
                name: "Player Deaths",
                value: "```" + response.death_count + "```",
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
              }
            )
            .setThumbnail(faceUrl)
            .setTimestamp();

          interaction.editReply("Fetched <:applesparkle:841615919428141066>");

          interaction.editReply({ embeds: [exampleEmbed] });
        });
      } catch (err) {
        axo.err("ERROR TRYING TO LOAD PLAYERSTATS: " + err);
        if (err == "ReferenceError: url is not defined") {
          await interaction.editReply(
            "```" +
              "Player Doesn't Exist On Database, They need to login to tristansmp.com atleast once" +
              "```"
          );
        } else {
          await interaction.editReply(
            "```" + "ERROR TRYING TO LOAD PLAYERSTATS" + "```"
          );
        }
      }

      process.on("uncaughtException", function (err) {
        if (err.toString() == "DBNOEXIST") {
          interaction.editReply(
            "```" +
              "Player Doesn't Exist On Database, They need to login to tristansmp.com at least once" +
              "```"
          );
        }
        if (err.toString() == "DIM") {
          interaction.editReply(
            "```" +
              "Player Hasn't Visted Every Dimension, They need to atleast visit every dimension once on tristansmp.com" +
              "```"
          );
        }
        if (err.toString() == "DIE") {
          interaction.editReply(
            "```" +
              "Player Hasn't Died Before, They need to atleast die once on tristansmp.com for me to pull up stats as deaths is a stat" +
              "```"
          );
        }
        axo.err(err);
      });
    }
    if (subcommand == "hypixel") {
      let pembed = await embed(interaction.guild);
      let i: CommandInteraction = interaction;
      hypixel
        .getPlayer(i.options.getString("username") ?? "twisttaan")
        .then(async (player) => {
          // Title
          pembed.setTitle("Hypixel Stats for " + player.nickname);
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
          const er = await evie.embed(interaction.guild!);
          er.setDescription(`Error: That player doesn't seem to exist`);
          i.reply({
            embeds: [er],
          });
        });
    }
  },
};
