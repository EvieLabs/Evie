const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var getJSON = require('get-json');
var ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playerstats')
		.setDescription('Replies with stats for a Minecraft Player')
        .addStringOption(option =>
			option.setName('username')
				.setDescription('The Minecraft Java Username')
				.setRequired(true)),
	async execute(interaction, client) {

		await interaction.reply("<a:loading:877782934696919040> Fetching Info `(This will hang if "+interaction.options.getString('username')+" hasn't visited the End and the Nether and died atleast once)`")
		var url = "http://202.131.88.29:25571/player/"+interaction.options.getString('username')+"/raw";

		


		try{getJSON(url, function(error, response){

			var username = interaction.options.getString('username');
			var url = "http://202.131.88.29:25571/player/"+username+"/raw";
			var uuid = "ec4b0c12-484e-4544-8346-cc1f1bdd10df";
			var whyjavalol = "com.djrapitops.plan.gathering.domain.WorldTimes"

			var currentChannel = interaction.currentChannel;
     
			console.log(error);
			// undefined
		 
			//console.log("D1: "+response.per_server_data["ec4b0c12-484e-4544-8346-cc1f1bdd10df"].sessions[0].extraData.data["com.djrapitops.plan.gathering.domain.WorldTimes"].times.world.times.SURVIVAL);
			//
			//console.log("D1: "+response.world_times.times.world.times.SURVIVAL);

			urlthing = response.url;

			//SKIN STUFF HERE

			if (response.BASE_USER === 'undefined') {
				throw ('DBNOEXIST');
			}
			if (response.world_times.times.world.times.SURVIVAL === 'undefined') {
				throw ('DIM');
			}
			if (response.world_times.times.world_nether.times.SURVIVAL === 'undefined') {
				throw ('DIM');
			}			
			if (response.world_times.times.world_the_end.times.SURVIVAL === 'undefined') {
				throw ('DIM');
			}
			if (response.death_count === 'undefined') {
				throw ('DIE');
			}			

			var uuid = response.BASE_USER.uuid;
			var faceUrl = "https://crafatar.com/renders/body/"+uuid;

			var skinDL = "https://crafatar.com/skins/"+uuid;

			var applySkin = "https://www.minecraft.net/profile/skin/remote?url="+skinDL+".png&model=slim";

		   // interaction.reply(response.url);
			const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Player Stats on TristanSMP for '+ username)
			.setDescription('Hey, ' + interaction.user.toString() + " heres a list of stats for " + username)
			.addFields(
				{ name: 'Play Time', value: "Overworld: " + "```"+ms(response.world_times.times.world.times.SURVIVAL, { long: true })+ "```" +
				 "Nether: " + "```"+ms(response.world_times.times.world_nether.times.SURVIVAL, { long: true })+ "```" +
				  "End: " + "```"+ms(response.world_times.times.world_the_end.times.SURVIVAL, { long: true })+ "```"},
			    { name: 'Player Deaths', value: "```"+response.death_count+"```" },
			    { name: 'Skin', value: "[Download]("+skinDL+")" + " | "+ "[Apply Skin]("+applySkin+")" },
			)
			.setImage(faceUrl)
			.setImage(faceUrl)
			.setTimestamp()
			.setFooter('Axolotl | by tristan#0005');

			interaction.editReply("Fetched <:applesparkle:841615919428141066>");
		
			interaction.editReply({ embeds: [exampleEmbed] });
		});
		
	
	}
	catch(err) {
		console.log("ERROR TRYING TO LOAD PLAYERSTATS: " + err)
		if(err == "ReferenceError: url is not defined"){
			await interaction.editReply("```"+"Player Doesn't Exist On Database, They need to login to tristansmp.com atleast once"+"```")
		}
		else {
			await interaction.editReply("```"+"ERROR TRYING TO LOAD PLAYERSTATS"+"```")
		}
	  }

	  process.on('uncaughtException', function (err) {

		if(err == 'DBNOEXIST'){
			interaction.editReply("```"+"Player Doesn't Exist On Database, They need to login to tristansmp.com at least once"+"```")
		}
		if(err == 'DIM'){
			interaction.editReply("```"+"Player Hasn't Visted Every Dimension, They need to atleast visit every dimension once on tristansmp.com"+"```")
		}
		if(err == 'DIE'){
			interaction.editReply("```"+"Player Hasn't Died Before, They need to atleast die once on tristansmp.com for me to pull up stats as deaths is a stat"+"```")
		}
		console.log(err);
	  })
		

	},
};