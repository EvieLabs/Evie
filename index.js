// require the needed discord.js classes
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('./config.json');
var getJSON = require('get-json')

// create a new Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// client.on('interactionCreate', interaction => {

// });

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log("button"+interaction);
    if(interaction.customId == "anotheraxo"){
        getJSON('https://axoltlapi.herokuapp.com', function(error, response){
 
            console.log(error);
            // undefined
         
            console.log(response.url);

            urlthing = response.url

           // interaction.reply(response.url);
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hey :)')
            .setDescription('Hey, ' + interaction.user.toString())
            .addFields(
                { name: 'Fun Fact', value: response.facts },
            )
            .setImage(response.url)
            .setTimestamp()
            .setFooter('Axolotl | by tristan#0005');

            const more = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('anotheraxo')
					.setLabel('Another One?')
					.setStyle('PRIMARY'),
			);
        
            interaction.reply({ embeds: [exampleEmbed], components: [more] });
        });
    }
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Load Commands

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// login to Discord with your app's token
client.login(token);
