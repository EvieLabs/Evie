const { SlashCommandBuilder } = require('@discordjs/builders');
const child = require('./startmc')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('cmdmcvm')
		.setDescription('Runs a command on the Axolotl VM')
        .addStringOption(option =>
			option.setName('command')
				.setDescription('Console Command?')
				.setRequired(true)),
	async execute(interaction) {
        if(interaction.user.toString() == '<@97470053615673344>' || interaction.user.toString() == '<@794485891740729344>') {
            const cmd = interaction.options.getString('command');
            await interaction.reply("Running command: ``"+cmd+"``")
            child.stdin.write(cmd);
		}
		else{
			await interaction.reply({ content: 'This is a John and Tristan Command', ephemeral: true });
		}
	},
};