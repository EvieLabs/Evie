"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Who has the most $EVIE?"),
    async execute(interaction, client) {
        // Axolotl Fetching Mechanic
        await interaction.reply("<a:loading:877782934696919040> Fetching Query");
        let exampleEmbed = new discord_js_1.MessageEmbed().setColor("#0099ff").setTimestamp();
        let data = await cs.leaderboard();
        let pos = 0;
        // This is to get First 10 Users )
        data.slice(0, 10).map((e) => {
            pos++;
            if (!interaction.client.users.cache.get(e.userID))
                return;
            exampleEmbed.addField(`${pos} - **${interaction.client.users.cache.get(e.userID).username}**`, `**Wallet:** <:eviecoin:900886713096888371> ${e.wallet} - **Bank:** <:eviecoin:900886713096888371> ${e.bank}`, false);
        });
        exampleEmbed.setTitle(`$EVIE Global Leaderboard`);
        exampleEmbed.setThumbnail(`https://cdn.discordapp.com/attachments/887532552481566770/900888795040317440/Evie_Bot-modified.png`);
        exampleEmbed.setFooter(`this list only shows users that are [cached]()`);
        // Fetched!
        interaction.editReply("Fetched <:applesparkle:841615919428141066>");
        // Send Embed
        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};
