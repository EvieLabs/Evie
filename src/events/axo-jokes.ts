import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";
import fetch from "node-fetch";

module.exports = {
  name: "messageCreate",
  async execute(message: Message) {
    //console.log('ok')
    //console.log(message.content)

    let msg = message.content.toString().toLowerCase();

    try {
      if (message.content.startsWith("j!")) {
        message.reply(
          "Jamble is now Evie! All my commands are slash commands now! To make them pop-up you must reinvite me using https://dsc.gg/eviebot and if you need more help checkout https://discord.gg/82Crd8tZRF"
        );
        console.log("Just told someone to reinvite me cause slashys | Jamble");
      }
    } catch (error) {
      console.log(error);
    }

    if (msg === "e!regslash" && message.author.id === "97470053615673344") {
      async function refreshCommands() {
        const client = message.client;
        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v9");
        require("dotenv").config();
        const token = process.env.CLIENT_TOKEN;
        const fs = require("fs");

        const Ecommands: string[] = [];
        const EcommandFiles = fs
          .readdirSync("./Ecommands")
          .filter((file) => file.endsWith(".js"));

        const tsmpmenus: string[] = [];
        const tsmpmenusFiles = fs
          .readdirSync("./tsmpmenu")
          .filter((file) => file.endsWith(".js"));

        const menus: string[] = [];
        const menusFiles = fs
          .readdirSync("./ctxmenus")
          .filter((file) => file.endsWith(".js"));

        const commands: string[] = [];
        const none = [];
        const commandFiles = fs
          .readdirSync("./commands")
          .filter((file) => file.endsWith(".js"));

        let clientId = "";
        const betaid = "900875807969406987";
        let TSMP = "819106797028769844";
        const jambl = "807927235478421534";

        // Place your client and guild ids here
        if (client.user!.id == betaid) {
          axo.startupMsg("RUNNING IN BETA MODE");
          clientId = betaid;
          TSMP = "901426442242498650";
        } else {
          axo.startupMsg("RUNNING IN PROD MODE");
          clientId = "807543126424158238";
          TSMP = "819106797028769844";
        }

        for (const file of commandFiles) {
          const command = require(`../commands/${file}`);
          commands.push(command.data.toJSON());
        }

        for (const file of EcommandFiles) {
          const Ecommand = require(`../Ecommands/${file}`);
          Ecommands.push(Ecommand.data.toJSON());
        }

        for (const file of menusFiles) {
          const menu = require(`../ctxmenus/${file}`);
          commands.push(menu.data);
        }

        for (const file of tsmpmenusFiles) {
          const tsmpmenu = require(`../tsmpmenu/${file}`);
          Ecommands.push(tsmpmenu.data);
        }

        const rest = new REST({ version: "9" }).setToken(token);

        (async () => {
          try {
            axo.startupMsg("Started refreshing application (/) commands.");

            // Reset all commands

            // await rest.put(
            //   // Routes.applicationGuildCommands(clientId, guildId),
            //   Routes.applicationGuildCommands(clientId, TSMP),
            //   // Routes.applicationCommands(clientId),
            //   { body: none }
            // );

            // Actually put commands

            await rest.put(
              // Routes.applicationGuildCommands(clientId, guildId),
              Routes.applicationGuildCommands(clientId, TSMP),
              // Routes.applicationCommands(clientId),
              { body: Ecommands }
            );

            await rest.put(Routes.applicationCommands(clientId), {
              body: commands,
            });

            axo.startupMsg("Successfully reloaded application (/) commands.");
            axo.startupMsg("------------------------------------------------");
            axo.startupMsg('"Ready to do my job on Discord" -Evie by tristan');
            axo.startupMsg(
              "My current ping to Discord is " + client.ws.ping.toString()
            );
            axo.startupMsg("------------------------------------------------");
          } catch (error) {
            axo.err(error);
          }
        })();
      }
      await refreshCommands();
      message.reply("Done!");
    }

    const exampleEmbed = await evie.embed(message.guild!);

    //
    // Application
    //

    if (
      msg.startsWith("New Application!") &&
      message.channel.id === "878082173498982470"
    ) {
      const applicationInfo = message.embeds[0];
      const applicant = applicationInfo.fields[2].value;

      // get member from username and tag
      const member = message.guild!.members.cache.find(
        (member) =>
          member.user.username.toLowerCase() === applicant.toLowerCase() ||
          member.user.tag.toLowerCase() === applicant.toLowerCase()
      );

      // make a channel
      const channel = await message.guild!.channels.create(
        `${member!.user.username}-application`,
        {
          type: "GUILD_TEXT",
          parent: "884224263509401650",
          permissionOverwrites: [
            {
              id: message.guild!.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: member!.id,
              allow: ["VIEW_CHANNEL"],
            },
            {
              id: evie.tsmp.staff.roleID,
              allow: ["VIEW_CHANNEL"],
            },
          ],
          reason: "New Application",
          topic: "Application for " + member!.user.username,
          nsfw: false,
          rateLimitPerUser: 0,
          position: 0,
        }
      );

      // edit application embed
      const applicationInfoParsed = applicationInfo
        .setDescription(`Date: ${new Date()}`)
        .setFooter(
          `Application ID: ${channel.id}`,
          member!.user.displayAvatarURL({ format: "png" })
        )
        .setTitle(`Application for ${member!.user.username}`);

      // add the application to the channel
      await channel.send({
        content: `<@&${evie.tsmp.staff.roleID}>`,
        embeds: [applicationInfoParsed],
      });
    }

    //
    // Time Savers
    //

    if (msg === "!d bump") {
      if (message.guild!.id == "819106797028769844") {
        exampleEmbed.setTitle("Fun Fact:");
        exampleEmbed.setDescription(
          "You can vote for `Tristan SMP` on more places then disboard, you just have to do it not from a Discord bot but rather these sites [top.gg](https://top.gg/servers/819106797028769844/vote), [discords.com](https://discords.com/servers/819106797028769844/upvote) and [discordservers.com](https://discordservers.com/panel/819106797028769844/bump)"
        );
        try {
          message.reply({ embeds: [exampleEmbed] });
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (msg === "!vane") {
      if (message.guild!.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Vane");
        exampleEmbed.setDescription(
          "Here on `Tristan SMP` we utilize a plugin called **Vane** <:Vane:884218809966276628> that adds alot of **QOL** changes and **enchants**, check out the [wiki](https://oddlama.github.io/vane/) for more info"
        );
        message.channel.send({ embeds: [exampleEmbed] });
        // message.delete()
      }
    }

    if (msg === "!apply" || msg === "!smp") {
      if (message.guild!.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Member System");
        exampleEmbed.setDescription(
          "Here on Evie's Discord we have our very own SMP called `Tristan SMP` It's a bedrock and java crossplay SMP!"
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
      if (message.guild!.id == "819106797028769844") {
        exampleEmbed.setTitle("Tristan SMP | Sign Shops");
        exampleEmbed.setDescription(
          "Here on `Tristan SMP` you can make shops with chests, check out the official [tutorial](https://www.tristansmp.com/blog/new-shops)"
        );
        // message.delete()
        message.channel.send({ embeds: [exampleEmbed] });
      }
    }
  },
};
