import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
const ee = require("../botconfig/embed.json");
const distube = require("../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current song")
    .setDefaultPermission(true),
  async execute(interaction) {
    const client = interaction.client;
    if (interaction.guild.id == "819106797028769844") {
      interaction.reply("Don't Try to stop the lofi radio!");
    } else {
      try {
        //things u can directly access in an interaction!
        const {
          member,
          channelId,
          guildId,
          applicationId,
          commandName,
          deferred,
          replied,
          ephemeral,
          options,
          id,
          createdTimestamp,
        } = interaction;
        const { guild } = member;
        const { channel } = member.voice;
        if (!channel)
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(
                  `:x: **Please join ${
                    guild.me.voice.channel ? "my" : "a"
                  } VoiceChannel First!**`
                ),
            ],
          });
        if (
          channel.guild.me.voice.channel &&
          channel.guild.me.voice.channel.id != channel.id
        ) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`:x: Join __my__ Voice Channel!`)
                .setDescription(`<#${guild.me.voice.channel.id}>`),
            ],
          });
        }
        try {
          let newQueue = interaction.client.distube.getQueue(guildId);
          if (!newQueue)
            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:x: **I'm Playing right now!**`),
                ],
              });
          await newQueue.stop();
          //Reply with a Message
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.color)
                .setTimestamp()
                .setTitle(`⏹ **Stopped playing and left the Channel!**`)
                .setFooter(
                  `💢 Action by: ${member.user.tag}`,
                  member.user.displayAvatarURL({ dynamic: true })
                ),
            ],
          });
          return;
        } catch (e) {
          console.log(e.stack ? e.stack : e);
          interaction.reply({
            content: `${client.allEmojis.x} | Error: `,
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`\`\`\`${e}\`\`\``),
            ],
          });
        }
      } catch (e) {
        console.log(String(e.stack));
      }
    }
  },
};
