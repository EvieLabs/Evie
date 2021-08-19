const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, DiscordAPIError } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userstats')
		.setDescription('Replies with stats for a user')
        .addStringOption(option =>
			option.setName('user')
				.setDescription('Mention the user you want stats for')
				.setRequired(true)),
	async execute(interaction, client) {
        // var user = interaction.options.getString('user');
        // var userid = user.toString().split("!").pop().split(">");
        // console.log(userid);
        // var du = new Discord.User(client, userid);
		// await interaction.reply(du.createdTimestamp());
        await interaction.reply("```Coming Soon! (This command in the future will pull up a Discord Users stats including when it was made and more! you should try /playerstats if you wanted Minecraft stats on a user)```");
	},
};