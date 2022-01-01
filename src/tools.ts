const mongoose = require("mongoose");
import {
  Guild,
  Interaction,
  MessageEmbed,
  GuildMember,
  Role,
} from "discord.js";
import { eModel } from "./index";
import { client } from "./index";
const { axo } = require("./axologs");
import fetch from "node-fetch";
import { Model, Models } from "mongoose";
import { initializeApp } from "firebase-admin/app";

export const app = initializeApp({
  credential: JSON.parse(process.env.FBA!),
});

// export tsmp

export const tsmp = {
  staff: {
    roleID: "819442569128706068",
  },
};

// String Parser

export async function parse(input: string, member: GuildMember) {
  input = input.replace("${mentionUser}", `<@${member.user.id}>`);
  input = input.replace("${displayName}", `${member.user.username}`);

  return input;
}

// Join Role

export async function isJoinRoleOn(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let joinRoleEnabled;

    if (typeof result[0].joinRoleEnabled == "undefined") {
      joinRoleEnabled = false;
    } else {
      joinRoleEnabled = result[0].joinRoleEnabled;
    }

    return joinRoleEnabled;
  } catch (error) {
    return false;
  }
}

export async function getJoinRole(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let joinRoleID: boolean | string;

    if (typeof result[0].joinRoleID == "undefined") {
      joinRoleID = false;
    } else {
      joinRoleID = result[0].joinRoleID;
    }

    return joinRoleID;
  } catch (error) {
    return false;
  }
}

export async function setJoinRole(guild: any, role: Role) {
  await eModel.findOneAndUpdate(
    {
      serverid: guild.id,
    },
    {
      joinRoleID: role.id,
    },
    {
      upsert: true,
      new: true,
    }
  );
  return;
}

export async function setJoinRoleEnable(guild: any, enable: Boolean) {
  await eModel.findOneAndUpdate(
    {
      serverid: guild.id,
    },
    {
      joinRoleEnabled: enable,
    },
    {
      upsert: true,
      new: true,
    }
  );
  return;
}

// Phisherman functions

export async function checkADomain(domain: string) {
  // using node fetch get https://api.phisherman.gg/v1/domains/{domain}

  const res = await fetch(
    `https://api.phisherman.gg/v2/domains/check/${domain}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer :${process.env.PHISHERMAN_TOKEN}`,
      },
    }
  );

  const json = await res.json();

  return json.verifiedPhish;
}

// Get If Detect phishing sites is Enabled

export async function getPhishingDetectionSwitch(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let phishingDetectionEnabled;

    if (typeof result[0].phishingDetectionEnabled == "undefined") {
      phishingDetectionEnabled = true;
    } else {
      phishingDetectionEnabled = result[0].phishingDetectionEnabled;
    }

    return phishingDetectionEnabled || false;
  } catch (error) {
    return true;
  }
}

//
// Goodbye Message Functions
//

// Get If Goodbye Message is Enabled

export async function getgoodbyeModuleSwitch(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let goodbyeMessageEnabled;

    if (typeof result[0].goodbyeMessageEnabled == "undefined") {
      goodbyeMessageEnabled = false;
    } else {
      goodbyeMessageEnabled = result[0].goodbyeMessageEnabled;
    }

    return goodbyeMessageEnabled || false;
  } catch (error) {
    return false;
  }
}

// Get Goodbye Channel

export async function getgoodbyeChannel(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let goodbyeChannel;

    if (typeof result[0].goodbyeChannel == "undefined") {
      goodbyeChannel = [];
    } else {
      goodbyeChannel = result[0].goodbyeChannel;
    }

    return goodbyeChannel || false;
  } catch (error) {
    return "";
  }
}

// Get Goodbye Message

export async function getgoodbyeMessage(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let goodbyeMessage;

    if (typeof result[0].goodbyeMessage == "undefined") {
      goodbyeMessage = "";
    } else {
      goodbyeMessage = result[0].goodbyeMessage;
    }

    return goodbyeMessage || false;
  } catch (error) {
    return "";
  }
}

//
// Welcome Message Functions
//

// Get If Welcome Message is Enabled

export async function getWelcomeModuleSwitch(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let welcomeMessageEnabled: boolean;

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

// Get If Welcome Message Ping is Enabled

export async function getWelcomePingSwitch(guild: any) {
  try {
    const result = await eModel.find({
      serverid: guild.id,
    });
    let welcomeMessagePingEnabled: boolean;

    if (typeof result[0].welcomeMessagePingEnabled == "undefined") {
      welcomeMessagePingEnabled = false;
    } else {
      welcomeMessagePingEnabled = result[0].welcomeMessagePingEnabled;
    }

    return welcomeMessagePingEnabled || false;
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
  "fuck",
  "nigg",
  "fuk",
  "cunt",
  "cnut",
  "bitch",
  "dick",
  "d1ck",
  "pussy",
  "asshole",
  "b1tch",
  "b!tch",
  "blowjob",
  "cock",
  "c0ck",
  "shit",
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
    return false;
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

export async function embed(guild: Guild) {
  const colour: any = await (await getEC(guild)).toString();
  let embed = new MessageEmbed()
    .setColor(colour)
    .setTimestamp()
    .setFooter("Evie", "https://www.eviebot.rocks/assets/EvieIcon.png");

  return embed;
}
