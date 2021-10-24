"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axologs_1 = require("../axologs");
module.exports = {
    name: "messageCreate",
    async execute(message, interaction) {
        //console.log('ok')
        //console.log(message.content)
        let msg = message.content.toString().toLowerCase();
        //
        // Time Savers
        //
        const exampleEmbed = new discord_js_1.MessageEmbed().setColor("#0099ff").setTimestamp();
        if (msg === "!d bump") {
            exampleEmbed.setTitle("Fun Fact:");
            exampleEmbed.setDescription("You can vote for `Tristan's Discord` on more places then disboard, you just have to do it not from a Discord bot but rather these sites [top.gg](https://top.gg/servers/819106797028769844/vote) and [discordservers.com](https://discordservers.com/panel/819106797028769844/bump)");
            try {
                message.reply({ embeds: [exampleEmbed], ephemeral: true });
            }
            catch (error) {
                console.log(error);
            }
        }
        if (msg === "!ts") {
            exampleEmbed.setTitle("Typescript Test Command");
            exampleEmbed.setDescription("If this sent it means Evie can now load TS files");
            try {
                message.reply({ embeds: [exampleEmbed] });
            }
            catch (error) {
                axologs_1.axo.log(error);
            }
        }
        if (msg === "!vane") {
            exampleEmbed.setTitle("Tristan SMP | Vane");
            exampleEmbed.setDescription("Here on `Tristan SMP` we utilize a plugin called **Vane** <:Vane:884218809966276628> that adds alot of **QOL** changes and **enchants**, check out the [wiki](https://oddlama.github.io/vane/) for more info");
            message.channel.send({ embeds: [exampleEmbed] });
            // message.delete()
        }
        if (msg === "!apply" || msg === "!smp") {
            exampleEmbed.setTitle("Tristan SMP | Member System");
            exampleEmbed.setDescription("Here on Tristan's Discord we have our very own SMP called `Tristan SMP` anyways to un-hide the channels for `Tristan SMP` you can either get the <@&895074861737734185> role from <#865796591574319134> or if your already a <@&878074525223378974>");
            exampleEmbed.addField("How do I apply?", "Once you have the channels un hidden you can apply [here](https://forms.gle/bat6SHnaBupnSXQUA) for <@&878074525223378974> so you can actually build/break instead of just exploring!");
            message.channel.send({ embeds: [exampleEmbed] });
            // message.delete()
        }
        if (msg === "!trade" || msg === "!shop") {
            exampleEmbed.setTitle("Tristan SMP | Sign Shops");
            exampleEmbed.setDescription("Here on `Tristan SMP` you can make shops with chests called a **TradeShop**, check out the official [tutorial](https://youtu.be/Mb2ks4U_YNo)");
            // message.delete()
            message.channel.send({ embeds: [exampleEmbed] });
        }
        if (msg === "encry") {
            message.channel.send("https://cdn.discordapp.com/attachments/885135206435151872/899242373714948126/unknown.png");
        }
        //
        // No Ping
        //
        if (msg.includes("531656855433379848") ||
            msg.includes("794485891740729344") ||
            msg.includes("491566122546495488") ||
            msg.includes("97470053615673344")) {
            let auth = message.author.toString();
            if (auth.includes(`531656855433379848`) ||
                auth.includes(`794485891740729344`) ||
                auth.includes(`491566122546495488`) ||
                auth.includes("97470053615673344")) {
                return;
            }
            try {
                message.reply(`<:appleflushed:853840463638691840> Hey ${message.author.username}! Please don't tag our staff directly. (they will come to you!)`);
            }
            catch (error) {
                console.error(error);
            }
        }
        //
        // Evie Flushed
        //
        if (msg.includes("<@!895808586742124615>")) {
            message.react("<:appleflushed:853840463638691840>");
            // message.channel.sendTyping();
            // await sleep(1200)
            // message.reply('ayoo why you ping me <:appleflushed:853840463638691840>')
            // message.channel.sendTyping();
            // await sleep(200)
            // message.channel.send('This is War ' + message.author.username.toString())
            // message.channel.sendTyping();
            // await sleep(1300)
            // message.channel.send(message.author.toString())
            // message.channel.sendTyping();
            // await sleep(400)
            // message.channel.send(message.author.toString())
            // message.channel.sendTyping();
            // await sleep(500)
            // message.channel.send(message.author.toString())
        }
        if (msg.includes("don't say his name...")) {
            if (message.author.toString() == "<@897660138347982858>") {
                message.reply("Bork!, he isnt some celeb and you aint some police like <@155149108183695360> and me");
            }
            function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
        }
    },
};
