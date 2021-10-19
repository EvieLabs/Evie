const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Coords to end portal near spawn'),
	async execute(interaction) {
		await interaction.reply('The End Portal Closest to spawn is at `1420 32 563`');
	},
};