const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('encry')
		.setDescription('Possibly makes Encry Mad'),
	async execute(interaction) {

            const sus_john_messages = [
            "<@!402297637161664522> your **poor**",
            `hello <@!402297637161664522>`,
            `aye <@!402297637161664522>`,
            `<@!402297637161664522> were like besties -Axolotl`,
            `<@!402297637161664522> ae`
            //``
        ];
        const index = Math.floor(Math.random() * (sus_john_messages.length - 1) + 1);
		await interaction.reply(sus_john_messages[index]);
	},
};