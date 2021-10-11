const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('johno')
		.setDescription('Replies with john!'),
	async execute(interaction) {

            const sus_john_messages = [
            "heyyy <@!794485891740729344>",
            `i have summoned <@!794485891740729344>`,
            `knock knock <@!794485891740729344>`,
            `morning <@!794485891740729344>`,
            `boo! <@!794485891740729344>`,
            `oi! <@!794485891740729344> ur a simp`,
            `**cheese** <@!794485891740729344>`,
            //``
        ];
        const index = Math.floor(Math.random() * (sus_john_messages.length - 1) + 1);
		await interaction.reply(sus_john_messages[index]);
	},
};