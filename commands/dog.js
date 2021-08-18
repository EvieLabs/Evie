const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
var getJSON = require('get-json')

var urlthing = "null";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('Replies with cute pic of a dog!'),
	async execute(interaction) {

           // interaction.reply(response.url);
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hey :)')
            .setDescription('What dog?' + interaction.user.toString())
            .addFields(
                { name: 'Choose...', value: "ill wait :)" },
            )
            .setTimestamp()
            .setFooter('Axolotl | by tristan#0005');

            const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
                    .setCustomId('dogs')
					.addOptions([
						{
							label: 'Evie',
							description: "Tristan's Dog",
							value: 'evie',
						},
						{
							label: 'Luna',
							description: "Ethan's Dog",
							value: 'luna',
						},
					]),
			);
        
            interaction.reply({ embeds: [exampleEmbed], components: [row] });
		//await interaction.reply(response.url);
	},
};



