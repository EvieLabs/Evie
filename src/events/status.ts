import { Client } from "discord.js";
import { axo } from "../axologs";

module.exports = {
  name: "ready",
  once: true,
  async execute(client: Client) {
    if (client.user?.id == "807543126424158238") {
      axo.log("Enabling Evie Network Status due to running in prod");
    }
  },
};
