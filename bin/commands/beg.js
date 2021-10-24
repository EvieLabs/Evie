"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for some $EVIE"),
    async execute(interaction, client) {
        // Axolotl Fetching Mechanic
        await interaction.reply("<a:loading:877782934696919040> Fetching Query");
        let exampleEmbed = new discord_js_1.MessageEmbed().setColor("#0099ff").setTimestamp();
        let result = await cs.beg({
            user: interaction.user,
            minAmount: 100,
            maxAmount: 400,
        });
        if (result.error) {
            const begMsg = [
                `Woof! stop begging! but do it again in ${result.time}`,
                `Woof! You homeless or something? But do it again in ${result.time}`,
                `Woof! Get a job and do something more productive, but you can beg again in ${result.time}`,
            ];
            const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
            exampleEmbed.setDescription(begMsg[index]);
        }
        else {
            const c = "`";
            const begMsg = [
                `Wooooooo! Elon just invested <:eviecoin:900886713096888371> ${result.amount} into you!`,
                `omfg tristan just ran ${c}/give ${interaction.user.username} $EVIE ${result.amount}${c}`,
            ];
            const index = Math.floor(Math.random() * (begMsg.length - 1) + 1);
            exampleEmbed.setDescription(begMsg[index]);
        }
        exampleEmbed.setFooter(`Imagine begging lol`);
        // Fetched!
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");
        // Send Embed
        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};
