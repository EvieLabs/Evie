import {
  ButtonInteraction,
  GuildMember,
  MessageEmbed,
  MessageReaction,
  Role,
  User,
} from "discord.js";
import { axo } from "../axologs";
import * as evie from "../tools";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(i: ButtonInteraction) {
    if (i.isButton()) {
      // apply the roles given from r
      const r: Role = i.guild!.roles.cache.find((r) => r.id == i.id) as Role;
    }

    try {
    } catch (error) {
      axo.err(error);
    }
  },
};
