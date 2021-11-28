import { SlashCommandBuilder } from "@discordjs/builders";
import { embed } from "../tools";

import { MessageEmbed } from "discord.js";
import { axo } from "../axologs";
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
import { MessageActionRow, MessageButton } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("vote"),
  async execute(interaction) {},
};
