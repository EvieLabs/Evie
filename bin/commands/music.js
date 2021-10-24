"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { axo } = require("../axologs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rand")
        .setDescription("This is a Test Command to test multi folder"),
    async execute(interaction) {
        // Axolotl Fetching Mechanic
        await interaction.reply("<a:loading:877782934696919040> Pinging Someone `i think`");
        // Make an embed
        const exampleEmbed = new MessageEmbed()
            .setTitle(`You've been chosen! yay`)
            .setColor("#0099ff")
            .setTimestamp();
        // get stuff
        const randUser = interaction.guild.members.cache.random();
        await interaction.guild.members
            .fetch()
            .then((data) => exampleEmbed.setDescription(`Hey! ${randUser} You win litreally nothing`))
            .catch((error) => axo.err(error));
        // Embed it!
        // Fetched!
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");
        // Send Embed
        interaction.editReply({ embeds: [exampleEmbed] });
        let tempPing = await interaction.channel.send(randUser + "test");
        await sleep(15);
        tempPing.message.delete();
        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
    },
};
