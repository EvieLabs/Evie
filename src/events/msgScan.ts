import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const BannedWords = await evie.getBL(message.guild);
    if (message.author.id !== message.guild.me.id) {
      if (
        BannedWords.some((word) =>
          message.toString().toLowerCase().includes(word)
        )
      ) {
        const yell = await message.channel.send(
          `Hey! ${message.author} A word in that message is banned in ${message.guild.name}!`
        );
        try {
          await message.delete();
          await sleep(2500);
          await yell.delete();
        } catch (error) {
          message.channel.send(
            `User ${message.author} said a banned word, but I don't have perms to delete it!`
          );
        }
      }
    }
  },
};
