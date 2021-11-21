import {
  ButtonInteraction,
  GuildMember,
  MessageEmbed,
  MessageReaction,
  User,
} from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(i: ButtonInteraction) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    const roles = await evie.getReactionRoles(i.guild);
    if (i.isButton()) {
      const r: evie.ReactionRoles = roles;

      console.log(r);

      // apply the roles given from r
    }

    try {
    } catch (error) {
      axo.err(error);
    }
  },
};
