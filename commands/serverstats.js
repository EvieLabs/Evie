const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const util = require('minecraft-server-util');
const {
    MessageEmbed,
    Discord,
    Channel
} = require('discord.js');
const imgur = require('imgur');
const { axo } = require('../axologs');
const ee = require("../botconfig/embed.json");


var serverIconLink = null;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Replies with Minecraft Server Stats!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Minecraft Java Server Address (If empty it will pull up TristanSMP Info')
				.setRequired(false)),
    async execute(interaction) {

        if(interaction.options.getString('input') == undefined){
            var realInput = "tristansmp.com";
        }
        if(!interaction.options.getString('input') == undefined){
            var realInput = interaction.options.getString('input');
        }
		
        util.status(realInput) // port is default 25565
            .then((response) => {
				interaction.deferReply()
                const data = response.favicon; // your image data	
                var base64Data = data.replace(/^data:image\/png;base64,/, "");
                imgur
                    .uploadBase64(base64Data)
                    .then((json) => {


                        axo.log("[SERVER STATS CACHE] "+json.link);
                        serverIconLink = json.link;

                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Server Stats')
                            .setDescription('**Server Address**: ' + "`"+realInput+"`")
                            .addFields({
                                name: 'Online Players',
                                value: response.onlinePlayers.toString() + "/" + response.maxPlayers.toString()
                            }, {
                                name: 'Motd',
                                value: "```" + response.description.descriptionText.toString() + "```"
                            }, {
                                name: 'Server Version',
                                value: "```"+response.version+"```",
                            }, 
							 {
                                name: 'Server Icon',
                                value: ":point_down:"
                            }, )
                            .setImage(serverIconLink)
                            .setTimestamp()
                            .setFooter(ee.footertext, ee.footericon);

                        interaction.editReply({
                            embeds: [exampleEmbed]
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