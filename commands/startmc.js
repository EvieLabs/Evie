const { SlashCommandBuilder } = require('@discordjs/builders');
const ngrok = require('ngrok');
const { ngrok_token } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startmcvm')
		.setDescription('Starts the Axolotl Minecraft VM Up')
		.addStringOption(option =>
			option.setName('luck')
				.setDescription('Add Luck to Starting the VM?')
				.setRequired(true)
				.addChoice('Yes', 'yes')
				.addChoice('No', 'no')
				.addChoice('Maybe', 'maybe')
				.addChoice('Just a bit', 'justabit')),
	async execute(interaction) {
        if(interaction.user.toString() == '<@97470053615673344>' || interaction.user.toString() == '<@794485891740729344>') {
            await ngrok.authtoken(ngrok_token);
            var ip = await ngrok.connect({proto: 'tcp', addr: 25565}); // tcp://0.tcp.ngrok.io:48590
            ip = ip.slice(6);

            

            await interaction.reply({ content: "Starting up your Minecraft server on ip ``"+ip+"``", ephemeral: false });

            var exec = require('child_process').exec;
            var child = exec('java -jar ../launcher-airplane.jar nogui', {
                cwd: "C:/Users/tjthe/Documents/Tristan Studios/axo/Axolotl/mcvm"
              },
            function (error, stdout, stderr){
            console.log('Output -> ' + stdout);
            if(error !== null){
              console.log("Error -> "+error);
            }
            });
            module.exports = child;
		}
		else{
			await interaction.reply({ content: 'This is a John and Tristan Command', ephemeral: true });
		}
	},
};