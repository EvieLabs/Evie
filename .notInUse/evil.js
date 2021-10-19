const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('evildetector')
		.setDescription('evil detector!')
        .addStringOption(option =>
			option.setName('person')
				.setDescription('Who is evil?')
				.setRequired(true)),
	async execute(interaction) {
        if(interaction.user.toString() == '<@97470053615673344>' || interaction.user.toString() == '<@794485891740729344>') {
            const person = interaction.options.getString('person');
            await interaction.reply({ content: person+' is detected of being evil', ephemeral: false });
		}
		else{
			await interaction.reply({ content: 'This is a joke command only for John and Tristan to enjoy! Sorryyyy', ephemeral: true });
		}
	},
};