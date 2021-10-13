// require the needed discord.js classes
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');


// create a new Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, "GUILD_MESSAGES"] }, { shardCount: 'auto' });
client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
// client.once('ready', () => {
//     setInterval(() => {
//         const activities_list = [
//             "tristan's code",
//             `${client.users.cache.size} users`,
//             `ur slash commands`,
//             //``
//         ];
//         const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
//         client.user.setActivity((activities_list[index]), { type: 'LISTENING' });
//     }, 50000); //Timer
// });

// Error Message for Commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Load Commands

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// login to Discord with your app's token
client.login(token);
