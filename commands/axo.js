const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
var getJSON = require('get-json')

var urlthing = "null";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('axo')
		.setDescription('Replies with cute pic of an Axolotl!'),
	async execute(interaction) {
        getJSON('https://axoltlapi.herokuapp.com', function(error, response){
 
            console.log(error);
            // undefined
         
            console.log(response.url);

            urlthing = response.url

           // interaction.reply(response.url);
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hey :)')
            .setDescription('Hey, ' + interaction.user.toString())
            .addFields(
                { name: 'Fun Fact', value: response.facts },
            )
            .setImage(response.url)
            .setTimestamp()
            .setFooter('Axolotl | by tristan#0005');

            const more = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('anotheraxo')
					.setLabel('Another One?')
					.setStyle('PRIMARY'),
			);
        
            interaction.reply({ embeds: [exampleEmbed], components: [more] });
        });
		//await interaction.reply(response.url);
	},
};



