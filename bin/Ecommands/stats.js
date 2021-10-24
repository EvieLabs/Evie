"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const systeminformation_1 = __importDefault(require("systeminformation"));
const axologs_1 = require("../axologs");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("stats")
        .setDescription("Stats about me and TristanSMP"),
    async execute(interaction, client) {
        // Axolotl Fetching Mechanic
        await interaction.reply("<a:loading:877782934696919040> Fetching Info");
        // Make an embed
        let exampleEmbed = new discord_js_1.MessageEmbed().setColor("#0099ff").setTimestamp();
        // Vars
        // Actions
        // N/a
        // Embed It!
        const cpu = await systeminformation_1.default.cpu();
        exampleEmbed
            .addField("<:evie:898393916812976159> Evie Stats <:evie:898393916812976159>", "━━━━━━━━━━━━━━━━━━━━━━━━", false)
            .addField("My VPS's CPU:", cpu.brand, true)
            .addField("Discord Lib:", "I'm Running discord.js inside of a child process in c#", true)
            .addField(`My Average Response Time:`, interaction.client.ws.ping.toString() + "ms", true)
            .addField("My CPU's Core Count:", cpu.cores.toString(), true)
            .addField("My CPU's Speed:", cpu.speedMax.toString() + "GHz", true)
            .addField("<a:tlogo:898393556878786560> Discord Server Stats <a:tlogo:898393556878786560>", "━━━━━━━━━━━━━━━━━━━━━━━━", false)
            .addField("Discord Server Members:", interaction.guild.memberCount.toString(), true);
        await interaction.guild.members
            .fetch()
            .then((data) => exampleEmbed.addField("Tristan SMP Members:", interaction.guild.roles.cache
            .find((role) => role.name == "TSMPMember")
            .members.size.toString(), true))
            .catch((error) => axologs_1.axo.err(error));
        await interaction.guild.members
            .fetch()
            .then((data) => exampleEmbed.addField("Staff Members:", interaction.guild.roles.cache
            .find((role) => role.name == "Staff")
            .members.size.toString(), true))
            .catch((error) => axologs_1.axo.err(error));
        // Fetched!
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");
        // Send Embed
        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};
