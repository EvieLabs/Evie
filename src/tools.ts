const mongoose = require("mongoose");
import { Guild, Interaction, MessageEmbed } from "discord.js";
import { eModel } from "./index";
import { client } from "./index";
const { axo } = require("./axologs");

// Status

export async function prodMode() {
  if (client.user.id == `900875807969406987`) {
    return false;
  } else {
    return true;
  }
}

// Get Banned Word List

export async function getBL(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let bannedWordList;

    if (typeof result[0].bannedWordList == "undefined") {
      bannedWordList = [];
    } else {
      bannedWordList = result[0].bannedWordList;
    }

    return bannedWordList.split(",") || false;
  } catch (error) {
    return [];
  }
}

// Get Embed Color

export async function getEC(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let colour;

    if (typeof result[0].color == "undefined") {
      colour = "#7289DA";
    } else {
      colour = result[0].color;
    }

    return colour.toString() || false;
  } catch (error) {
    return "#7289DA";
  }
}

// Default Embed

export async function embed(guild: any) {
  const colour: any = await (await getEC(guild)).toString();
  let embed = new MessageEmbed()
    .setColor(colour)
    .setTimestamp()
    .setDescription("Error!");

  return embed;
}
