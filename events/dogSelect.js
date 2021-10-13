module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		const fetch = require('node-fetch');
		const { MessageEmbed } = require('discord.js');
		async function getData(url) {
			const resp = await (await fetch(url)).text();
			return resp.trim().split('\n');
		}

		async function getLunaPictures() {
			return getData('https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/luna.txt');
		}

		async function getEviePictures() {
			return getData('https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/evie.txt');
		}

		function getRandomFromList(list) {
			return list[Math.floor(Math.random() * list.length)];
		}

		if (!interaction.isSelectMenu()) return;
		if(interaction.customId == 'dogs') {
			if(interaction.values == 'luna') {

				// lunar

				const lunaEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Hey :)')
					.setDescription('Hey, ' + interaction.user.toString())
					.addFields(
						{ name: 'Fun Fact', value: 'I have no fun facts.... ETHANNNNNNNN' },
					)
					.setImage(getRandomFromList(await getLunaPictures()))
					.setTimestamp()
					.setFooter('Axolotl | by tristan#0005');

				await interaction.channel.send({ embeds: [lunaEmbed] });

			}

			if(interaction.values == 'evie') {

				// evie


				const evieEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Hey :)')
					.setDescription('Hey, ' + interaction.user.toString())
					.addFields(
						{ name: 'Fun Fact', value: 'I have no fun facts.... TRISTANNNNNNN' },
					)
					.setImage(getRandomFromList(await getEviePictures()))
					.setTimestamp()
					.setFooter('Axolotl | by tristan#0005');

				await interaction.channel.send({ embeds: [evieEmbed] });


			}
		}
	},
};