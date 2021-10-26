import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";

module.exports = {
  name: "messageCreate",
  async execute(message, interaction) {
    //console.log('ok')
    //console.log(message.content)

    let msg = message.content.toString().toLowerCase();

    try {
      if (message.content.startsWith("j!")) {
        message.reply(
          "Jamble is now Evie! All my commands are slash commands now! To make them pop-up you must reinvite me using https://dsc.gg/eviebot"
        );
        console.log("JUST SAID MY MESSAGE!");
      }
    } catch (error) {
      console.log(error);
    }

    //
    // Time Savers
    //

    const exampleEmbed = new MessageEmbed().setColor("#0099ff").setTimestamp();

    if (msg === "!d bump") {
      if (message.guild.id == "819106797028769844") {
        exampleEmbed.setTitle("Fun Fact:");
        exampleEmbed.setDescription(
          "You can vote for `Tristan's Discord` on more places then disboard, you just have to do it not from a Discord bot but rather these sites [top.gg](https://top.gg/servers/819106797028769844/vote) and [discordservers.com](https://discordservers.com/panel/819106797028769844/bump)"
        );
        try {
          message.reply({ embeds: [exampleEmbed], ephemeral: true });
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (msg === "!vane") {
      if (message.guild.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Vane");
        exampleEmbed.setDescription(
          "Here on `Tristan SMP` we utilize a plugin called **Vane** <:Vane:884218809966276628> that adds alot of **QOL** changes and **enchants**, check out the [wiki](https://oddlama.github.io/vane/) for more info"
        );
        message.channel.send({ embeds: [exampleEmbed] });
        // message.delete()
      }
    }

    if (msg === "!apply" || msg === "!smp") {
      if (message.guild.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Member System");
        exampleEmbed.setDescription(
          "Here on Tristan's Discord we have our very own SMP called `Tristan SMP` It's a bedrock and java crossplay SMP!"
        );
        exampleEmbed.addField(
          "How do I apply?",
          "You can simply fill out the application [here](https://forms.gle/bat6SHnaBupnSXQUA) for <@&878074525223378974> so you can actually build/break instead of just exploring!"
        );
        exampleEmbed.addField(
          "How do I Join",
          "You can refer to the join instructions [here](https://discord.com/channels/819106797028769844/819446614568599582/884646964074020905)"
        );
        message.channel.send({ embeds: [exampleEmbed] });
        // message.delete()
      }
    }

    if (msg === "!trade" || msg === "!shop") {
      if (message.guild.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Sign Shops");
        exampleEmbed.setDescription(
          "Here on `Tristan SMP` you can make shops with chests called a **TradeShop**, check out the official [tutorial](https://youtu.be/Mb2ks4U_YNo)"
        );
        // message.delete()
        message.channel.send({ embeds: [exampleEmbed] });
      }
    }

    //
    // Evie Flushed
    //

    if (msg.includes("<@!895808586742124615>")) {
      message.react("<:appleflushed:853840463638691840>");
    }

    if (msg.includes("don't say his name...")) {
      if (message.author.toString() == "<@897660138347982858>") {
        message.reply(
          "Bork!, he isnt some celeb and you aint some police like <@155149108183695360> and me"
        );
      }

      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
    }
  },
};
