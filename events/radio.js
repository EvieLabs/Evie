const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const { axo } = require('../axologs')

        

        axo.startupMsg("Starting the Radio Systems")

        let options = {
            leaveOnEmpty: false,
        }

        await client.distube.playVoiceChannel(client.channels.cache.get('897433283921580062'), "https://www.youtube.com/playlist?list=PL4pro5D7LdbirRYxvctFXEuk8tTz8fdut", options)   

        newQueue = client.distube.getQueue("819106797028769844"); 
        newQueue.shuffle();
        await newQueue.setRepeatMode(2)


	},
};