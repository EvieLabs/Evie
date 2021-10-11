module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

        client.user.setPresence({
            status: `dnd`,
          });

		console.log(`Ready! Logged in as ${client.user.tag}`);

        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const { token } = require('../config.json');
        const fs = require('fs');
        
        const commands = [];
        const none = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        
        // Place your client and guild ids here
        const clientId = '895808586742124615';
        const guildId = '800977362757091329';
        const TSMP = '819106797028769844';
        
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }
        
        const rest = new REST({ version: '9' }).setToken(token);
        
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    //Routes.applicationGuildCommands(clientId, guildId),
                    Routes.applicationGuildCommands(clientId, TSMP),
                    //Routes.applicationCommands(clientId),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
	},
};