module.exports = {
    name: 'messageCreate',
    async execute(message) {
        //console.log('ok')
        //console.log(message.content)

        let msg = message.content.toString().toLowerCase();

        if(msg.includes("axolotl")){
            message.react('<:appleflushed:853840463638691840>');
        }

        if(msg.includes("<@!895808586742124615>")){
            message.react('<:appleflushed:853840463638691840>');
            message.reply('ayoo why you ping me <:appleflushed:853840463638691840>')
        }
    }
}