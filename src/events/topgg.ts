/* 
Copyright 2022 Tristan Camejo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
      {
        webhookPort: 5000,
        webhookAuth: "weewoothisismyamazingpasswordokthx4398%*(5",
      }
    );

    dbl.webhook.on("ready", (hook) => {
      console.log(
        `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
      );
    });
    dbl.webhook.on("vote", async (vote) => {
      console.log(`User with ID ${vote.user} just voted!`);
      const votedUser = await client.users.fetch(`${vote.user}`);
      const voteAmount = 45000;

      const announceChannel = client.channels.cache.get("905017507318997053");

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
