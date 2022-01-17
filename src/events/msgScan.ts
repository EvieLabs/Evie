import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.author.bot) return;
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    let BannedWords: Array<String> = [];
    if (await evie.getDBL(message.guild)) {
      BannedWords = [...(await evie.getBL(message.guild)), ...evie.badwords];
    } else {
      BannedWords = await evie.getBL(message.guild);
    }

    if (message.author.id !== message.guild.me.id) {
      if (
        BannedWords.some((word) =>
          message.toString().toLowerCase().includes(word.toLowerCase())
        )
      ) {
        try {
          await message.delete();
          await sleep(1500);
        } catch (error) {
          message.channel.send(
            `User ${message.author} said a banned word, but I don't have perms to delete it!`
          );
        }
      }
    }
  },
};
