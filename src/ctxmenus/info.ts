import { embed } from "../tools";
import * as evie from "../tools";
import { axo } from "../axologs";
import {
  ContextMenuInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

module.exports = {
  data: {
    name: "User Info",
    type: 2,
  },
  async execute(i: ContextMenuInteraction) {
    i.reply("soon!");
  },
};
