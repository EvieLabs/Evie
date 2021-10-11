const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Pings someone random!'),
	async execute(interaction) {
		interaction.guild.members.cache.get();
		const user = interaction.guild.members.cache.random();
		await interaction.reply('Hey ' + user.toString() + ' Please don\'t block me i swear its not my fault!');
	},
};