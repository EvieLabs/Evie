import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
const ee = require("../botconfig/embed.json");
const distube = require("../index");
import Soundcloud from "soundcloud.ts";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips a song!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The search query")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      //console.log(interaction, StringOption)

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
            new MessageEmbed().setTitle(
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
              .setTitle(`:x: Join __my__ Voice Channel!`)
              .setDescription(`<#${guild.me.voice.channel.id}>`),
          ],
        });
      }
      try {
        let newQueue = interaction.client.distube.getQueue(guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)
          return interaction.reply({
            embeds: [
              new MessageEmbed().setTitle(
                `:x: **I am Playing nothing right now!**`
              ),
            ],
          });
        await newQueue.skip();
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTimestamp()
              .setTitle(`⏭ **Skipped to the next Song!**`)
              .setFooter(
                `💢 Action by: ${member.user.tag}`,
                member.user.displayAvatarURL({ dynamic: true })
              ),
          ],
        });
      } catch (e) {
        console.log(e.stack);
      }
    } catch (e) {
      console.log(e.stack);
    }
  },
};
