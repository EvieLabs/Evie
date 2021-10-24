"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const minecraft_server_util_1 = __importDefault(require("minecraft-server-util"));
const discord_js_1 = require("discord.js");
const imgur_1 = __importDefault(require("imgur"));
const axologs_1 = require("../axologs");
const embed_json_1 = __importDefault(require("../botconfig/embed.json"));
var serverIconLink = null;
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("serverstats")
        .setDescription("Replies with Minecraft Server Stats!")
        .addStringOption((option) => option
        .setName("input")
        .setDescription("Minecraft Java Server Address (If empty it will pull up TristanSMP Info")
        .setRequired(false)),
    async execute(interaction) {
        let realInput = "tristansmp.com";
        if (interaction.options.getString("input") == undefined) {
            realInput == "tristansmp.com";
        }
        if (!interaction.options.getString("input") == undefined) {
            realInput == interaction.options.getString("input");
        }
        minecraft_server_util_1.default
            .status(realInput) // port is default 25565
            .then((response) => {
            interaction.deferReply();
            let data = response.favicon; // your image data
            var base64Data = data.replace(/^data:image\/png;base64,/, "");
            imgur_1.default
                .uploadBase64(base64Data)
                .then((json) => {
                axologs_1.axo.log("[SERVER STATS CACHE] " + json.link);
                const serverIconLink = json.link;
                const exampleEmbed = new discord_js_1.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Server Stats")
                    .setDescription("**Server Address**: " + "`" + realInput + "`")
                    .addFields({
                    name: "Online Players",
                    value: response.onlinePlayers.toString() +
                        "/" +
                        response.maxPlayers.toString(),
                }, {
                    name: "Motd",
                    value: "```" +
                        response.description.descriptionText.toString() +
                        "```",
                }, {
                    name: "Server Version",
                    value: "```" + response.version + "```",
                }, {
                    name: "Server Icon",
                    value: ":point_down:",
                })
                    .setImage(serverIconLink)
                    .setTimestamp()
                    .setFooter(embed_json_1.default.footertext, embed_json_1.default.footericon);
                interaction.editReply({
                    embeds: [exampleEmbed],
                });
            })
                .catch((error) => {
                axologs_1.axo.err(error.message);
            });
        })
            .catch((err) => {
            axologs_1.axo.err(err.message);
        });
    },
};
