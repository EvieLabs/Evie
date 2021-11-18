import { MessageEmbed } from "discord.js";
const { axo } = require("../axologs");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Evie Doesn't Have time for you ;)

    client.user.setPresence({
      status: "dnd",
    });

    // Her sleeping function

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    // server info

    // Bot  Playground warning

    // setInterval(() => {
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "**We strongly recommend you mute this channel! So you don't get pinged by others using commands on you!**"
    //     );
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "https://cdn.discordapp.com/attachments/885135206435151872/899155614700298330/IG7P2NlKjz.gif"
    //     );
    // }, 900000);
    // setInterval(() => {
    //   client.channels.cache
    //     .get("877795126615879750")
    //     .send(
    //       "For help on commands on `Tristan's Discord` Check out <#894819677136633856>"
    //     );
    // }, 600000);

    // Night night console!

    // Login
    axo.startupMsg(`===================`);

    axo.startupMsg(`Ready! Logged in as ${client.user.tag}`);
    await client.guilds
      .fetch()
      .then((data) => {
        client.guilds.cache.forEach(async (guild) => {
          await guild.members.fetch().then(async (data) => {
            const owner = await guild.fetchOwner();
            console.log(`${guild.name} | ${owner.displayName}`);
          });
        });
      })
      .catch((error) => axo.err(error));

    // Slashys (moved to regslash.ts)

    // status

    const announceChannel = client.channels.cache.get("905017507318997053");

    try {
      announceChannel.send(
        `<:evie:907925898387402802> I've auto Restarted to load all my **new** changes!`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
