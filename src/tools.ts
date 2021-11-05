const mongoose = require("mongoose");
import { Guild, Interaction, MessageEmbed } from "discord.js";
import { eModel } from "./index";
import { client } from "./index";
const { axo } = require("./axologs");

// Bad Words

export const badwords: Array<string> = [
  "abbo",
  "abo",
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
  "gimp",
  "golliwog",
  "gook",
  "goy",
  "goyim",
  "gyp",
  "gypsy",
  "half-breed",
  "halfbreed",
  "heeb",
  "homo",
  "hooker",
  "idiot",
  "insane",
  "insanitie",
  "insanity",
  "jap",
  "kaffer",
  "kaffir",
  "kaffir",
  "kaffre",
  "kafir",
  "kike",
  "kraut",
  "lame",
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
  "wop",
  "yid",
  "zog",
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
      defaultBannedWordList = false;
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
  let embed = new MessageEmbed().setColor(colour).setTimestamp();

  return embed;
}
