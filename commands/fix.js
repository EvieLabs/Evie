const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fix')
		.setDescription('Fixes any problem!'),
	async execute(interaction) {
		await interaction.reply('To fix your problem use something called [google](http://google.com/)');
	},
};