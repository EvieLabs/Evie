const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coords')
		.setDescription('Spits a random set of coords on tristansmp.com'),
	async execute(interaction) {

		const idk_msg = [
			'686 64 376',
			'2269 64 1633',
			'2793 63 2402',
			'710 146 -6953',
			'760 70 -7263',
			'1420 32 563',
			// ``
		];
		const index = Math.floor(Math.random() * (idk_msg.length - 1) + 1);
		await interaction.reply('Here\'s a random landmark in the overworld on tristansmp.com `' + idk_msg[index] + '`');
		await interaction.channel.send('Hey, ' + interaction.user.toString() + ' want your landmark added to this command? If so directly contact Tristan with the command `/dmtristan <message>` in <#877795126615879750>');
	},
};