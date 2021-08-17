module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

        const fetch = require("node-fetch");
    async function getData(url) {
         const resp = await (await fetch(url)).text();
         return resp.trim().split("\n");
    }

    async function getPictures() {
        return getData("https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/luna.txt");
    }

    function getRandomFromList(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

        if (!interaction.isSelectMenu()) return;
        if(interaction.customId == "dogs"){
            if(interaction.values == "luna"){

                //lunar

                //interaction.channel.send('lunar')
                await interaction.channel.send(getRandomFromList(await getPictures()));
            } else

            //evie

            interaction.channel.send('evie')


            interaction.message.delete();
        }
	},
};