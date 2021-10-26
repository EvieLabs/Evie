import { MessageEmbed } from "discord.js";
const DBL = require("top.gg");

const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const { axo } = require("../axologs");

    axo.startupMsg("Starting top.gg services");

    const dbl = new DBL(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwNzU0MzEyNjQyNDE1ODIzOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM1MjMxOTkwfQ.n3yvmVcTBqkgtiE_i3Dl9IBITwNzhFrZr6O_udG35Ec",
      { webhookPort: 5000, webhookAuth: "password" }
    );

    dbl.webhook.on("ready", (hook) => {
      console.log(
        `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
      );
    });
    dbl.webhook.on("vote", async (vote) => {
      console.log(`User with ID ${vote.user} just voted!`);
      const votedUser = client.users.cache.get(`${vote.user}`);
      const voteAmount = 45000;
      const announceChannel = client.channels.cache.get("902455135609970698");

      let result = await cs.addMoney({
        user: votedUser,
        amount: voteAmount,
        wheretoPutMoney: "wallet",
      });

      // Announce Channel

      try {
        announceChannel.send(
          `Thanks for voting <@${votedUser.id}>! You earnt <:eviecoin:900886713096888371> 45,000 Evie Coins for that!`
        );
      } catch (error) {
        console.log(error);
      }

      // Direct Message

      try {
        votedUser.message(
          `Thanks for voting <@${votedUser.id}>! You earnt <:eviecoin:900886713096888371> 45,000 Evie Coins for that!`
        );
      } catch (error) {
        console.log(error);
      }
    });
  },
};
