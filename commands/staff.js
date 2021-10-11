const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeline')
		.setDescription("Sends an image of the last timeline generated for tristansmp.com"),
        async execute(interaction) {
		await interaction.reply("https://cdn.discordapp.com/attachments/819719663289106514/890097693014261770/unknown.png");
	},
};