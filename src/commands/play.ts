import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
const ee = {
  // wrongcolor is red hex
  wrongcolor: "#ff0000",
};
const distube = require("../index");

import Soundcloud from "soundcloud.ts";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The search query")
        .setRequired(true)
    ),
  async execute(interaction) {
    let exampleEmbed = await embed(interaction.guild);
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
      if (!channel) {
        exampleEmbed.setTitle(
          `:x: **Please join ${
            guild.me.voice.channel ? "__my__" : "a"
          } VoiceChannel First!**`
        );
        return interaction.reply({
          embeds: [exampleEmbed],
        });
      }
      if (channel.userLimit != 0 && channel.full) {
        exampleEmbed.setTitle(
          `<:declined:780403017160982538> Your Voice Channel is full, I can't join!`
        );
        return interaction.reply({ embeds: [exampleEmbed] });
      }
      if (
        channel.guild.me.voice.channel &&
        channel.guild.me.voice.channel.id != channel.id
      ) {
        exampleEmbed.setTitle(
          `<:declined:780403017160982538> I am already connected somewhere else`
        );
        return interaction.reply({ embeds: exampleEmbed });
      }
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
      const Text = interaction.options.getString("song"); //same as in StringChoices //RETURNS STRING
      //update it without a response!
      let newmsg = await interaction
        .reply({
          content: `🔍 Searching... \`\`\`${Text}\`\`\``,
        })
        .catch((e) => {
          console.log(e);
        });
      try {
        const soundcloud = new Soundcloud();
        const search = await soundcloud.tracks.searchV2({ q: Text });
        const searchResultURL =
          await search.collection[0].permalink_url.toString();
        if (search) {
          if (
            search.collection[0].monetization_model == "BLACKBOX" ||
            search.collection[0].monetization_model == "NOT_APPLICABLE"
          ) {
            let queue = interaction.client.distube.getQueue(guildId);
            //Edit the reply
            if (!queue)
              options.textChannel = guild.channels.cache.get(channelId);
            await interaction.client.distube.playVoiceChannel(
              channel,
              searchResultURL,
              options
            );
            interaction
              .editReply({
                content: `${
                  queue?.songs?.length > 0 ? "👍 Added" : "🎶 Now Playing"
                }: \`\`\`css\n${Text}\n\`\`\``,
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            interaction.editReply(
              `Sadly the song requested is monetized on SoundCloud meaning I cannot play it. I know this sucks but it's the only "legal" way`
            );
          }
        } else {
          interaction.editReply(
            `Sadly the song requested was not found on SoundCloud, please be more precise`
          );
        }
      } catch (e) {
        console.log(e.stack ? e.stack : e);
      }
    } catch (e) {
      console.log(String(e.stack));
    }
  },
};
