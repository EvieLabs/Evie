import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
const ee = require("../botconfig/embed.json");
const distube = require("../index");

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
    if (interaction.guild.id == "819106797028769844") {
      interaction.reply("Don't Try to stop the lofi radio!");

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
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(
                  `:x: **Please join ${
                    guild.me.voice.channel ? "__my__" : "a"
                  } VoiceChannel First!**`
                ),
            ],
          });
        if (channel.userLimit != 0 && channel.full)
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  `<:declined:780403017160982538> Your Voice Channel is full, I can't join!`
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
                .setTitle(
                  `<:declined:780403017160982538> I am already connected somewhere else`
                ),
            ],
          });
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
          let queue = interaction.client.distube.getQueue(guildId);
          let options = {
            member: member,
          };
          //Edit the reply
          interaction
            .editReply({
              content: `${
                queue?.songs?.length > 0 ? "👍 Added" : "🎶 Now Playing"
              }: \`\`\`css\n${Text}\n\`\`\``,
            })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          console.log(e.stack ? e.stack : e);
          interaction.editReply({
            content: `:x: | Error: `,
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
