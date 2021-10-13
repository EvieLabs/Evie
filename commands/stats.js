const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { os } = require('os');
const si = require('systeminformation');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Stats about Axolotl and TristanSMP'),
	async execute(interaction) {

		// Axolotl Fetching Mechanic
		await interaction.reply('<a:loading:877782934696919040> Fetching Info');

		// Make an embed

		const exampleEmbed = new MessageEmbed()
			.setTitle('Axolotl Stats')
			.setColor('#0099ff')
			.setTimestamp();

		// Vars

		let cpuInfo = 'placeholder';


		// Actions

		si.cpu()
			.then(data => cpuInfo = JSON.stringify(data))
			.catch(error => console.error(error));


		// Embed It!

		exampleEmbed.addField('Cpu:', cpuInfo, false);

		exampleEmbed.addField('CPU Temp:', si.cpuTemperature().toString());
		
		exampleEmbed.addField('Mesage from tristan:', "I give up this just doesnt work and does not like me so i will not fix this...");

		// Fetched!

		interaction.editReply('Fetched <:applesparkle:841615919428141066>');

		// Send Embed

		await interaction.editReply({ embeds: [exampleEmbed] });


	},
};