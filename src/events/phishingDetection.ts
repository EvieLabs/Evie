import { Message } from "discord.js";
import * as evie from "../tools";
module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    if (message.inGuild()) {
      if (await evie.getPhishingDetectionSwitch(message.member?.guild)) {
        function extractHostname(url) {
          var hostname;
          //find & remove protocol (http, ftp, etc.) and get hostname
          if (url.indexOf("//") > -1) {
            hostname = url.split("/")[2];
          } else {
            hostname = url.split("/")[0];
          }
          //find & remove port number
          hostname = hostname.split(":")[0];
          //find & remove "?"
          hostname = hostname.split("?")[0];

          return hostname;
        }
        const urlRegex =
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        function linkify(text) {
          return text.match(urlRegex, "");
        }
        const links = linkify(message.content);
        if (links) {
          links.forEach(async (element) => {
            if (await evie.checkADomain(extractHostname(element))) {
              await evie.reportACaughtPhish(
                extractHostname(element),
                message.member?.guild
              );
              try {
                await message.delete();
                message.channel.send(
                  `${message.author} sent a phishing link above, I deleted it!`
                );
              } catch (error) {
                message.channel.send(
                  `${message.author} sent a phishing link above, but I was unable to delete it due to a lack of permissions`
                );
              }
            }
          });
        }
      }
    }
  },
};
