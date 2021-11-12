import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import util from "minecraft-server-util";
import { MessageEmbed, Channel } from "discord.js";
import imgur from "imgur";
import { axo } from "../axologs";

var serverIconLink = null;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Replies with Minecraft Server Stats!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription(
          "Minecraft Java Server Address (If empty it will pull up TristanSMP Info"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    let realInput: string = "tristansmp.com";
    if (!interaction.options.getString("input")) {
      realInput == interaction.options.getString("input");
    }

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
  },
};
