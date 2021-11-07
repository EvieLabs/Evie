const mongoose = require("mongoose");
import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { Guild, Interaction, MessageEmbed } from "discord.js";
import { eModel } from "./index";
import { client } from "./index";
const { axo } = require("./axologs");

// String Parser

export async function parse(input: String, interaction: any) {
  input = input.replace("${mentionUser}", `<@${await interaction.user.id}>`);

  return input;
}

// Get If Welcome Message is Enabled

export async function getWelcomeModuleSwitch(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let welcomeMessageEnabled;

    if (typeof result[0].welcomeMessageEnabled == "undefined") {
      welcomeMessageEnabled = false;
    } else {
      welcomeMessageEnabled = result[0].welcomeMessageEnabled;
    }

    return welcomeMessageEnabled || false;
  } catch (error) {
    return false;
  }
}

// Get Welcome Channel

export async function getWelcomeChannel(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let welcomeChannel;

    if (typeof result[0].welcomeChannel == "undefined") {
      welcomeChannel = [];
    } else {
      welcomeChannel = result[0].welcomeChannel;
    }

    return welcomeChannel || false;
  } catch (error) {
    return "";
  }
}

// Get Welcome Message

export async function getWelcomeMessage(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let welcomeMessage;

    if (typeof result[0].welcomeMessage == "undefined") {
      welcomeMessage = "";
    } else {
      welcomeMessage = result[0].welcomeMessage;
    }

    return welcomeMessage || false;
  } catch (error) {
    return "";
  }
}

// Bad Words

export const badwords: Array<string> = [
  "beeyotch",
  "biatch",
  "bitch",
  "chinaman",
  "chinamen",
  "chink",
  "coolie",
  "coon",
  "crazie",
  "crazy",
  "crip",
  "cuck",
  "cunt",
  "dago",
  "daygo",
  "dego",
  "dick",
  "douchebag",
  "dumb",
  "dyke",
  "eskimo",
  "fag",
  "faggot",
  "fatass",
  "fatso",
  "gash",
  "golliwog",
  "goyim",
  "gyp",
  "gypsy",
  "half-breed",
  "halfbreed",
  "heeb",
  "idiot",
  "insane",
  "insanitie",
  "insanity",
  "kaffer",
  "kaffir",
  "kaffir",
  "kaffre",
  "kafir",
  "kike",
  "kraut",
  "lardass",
  "lesbo",
  "lunatic",
  "mick",
  "negress",
  "negro",
  "nig",
  "nig-nog",
  "nigga",
  "nigger",
  "nigguh",
  "nip",
  "pajeet",
  "paki",
  "pickaninnie",
  "pickaninny",
  "prostitute",
  "pussie",
  "pussy",
  "raghead",
  "retard",
  "sambo",
  "shemale",
  "skank",
  "slut",
  "soyboy",
  "spade",
  "sperg",
  "spic",
  "spook",
  "squaw",
  "street-shitter",
  "tard",
  "tits",
  "titt",
  "trannie",
  "tranny",
  "twat",
  "wetback",
  "whore",
  "wigger",
  "shit",
  "fuck",
  "bulshit",
  "bullshit",
];
// Status

export async function prodMode() {
  if (client.user.id == `900875807969406987`) {
    return false;
  } else {
    return true;
  }
}

// Get If Default Banned Word List is enabled

export async function getDBL(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let defaultBannedWordList;

    if (typeof result[0].defaultBannedWordList == "undefined") {
      defaultBannedWordList = [];
    } else {
      defaultBannedWordList = result[0].defaultBannedWordList;
    }

    return defaultBannedWordList || false;
  } catch (error) {
    return [];
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
      colour = "#f47fff";
    } else {
      colour = result[0].color;
    }

    return colour.toString() || false;
  } catch (error) {
    return "#f47fff";
  }
}

// Default Embed

export async function embed(guild: any) {
  const colour: any = await (await getEC(guild)).toString();
  let embed = new MessageEmbed().setColor(colour).setTimestamp();

  return embed;
}
