const mongoose = require("mongoose");
import { Guild, Interaction, MessageEmbed } from "discord.js";
import { eModel } from "./index";
import hexRgb from "hex-rgb";

export async function getEC(guild: any) {
  const result = await eModel.find({
    serverid: guild.id,
  });

  console.log("neeiiill", result);

  //let colour = result[0].color;
  //console.log("boo", colour);

  return "#7289DA" || false;
}

export async function embed(guild: any) {
  const colour: any = await (await getEC(guild)).toString();
  console.log("COLOURRRRR", colour);
  let embed = new MessageEmbed()
    .setColor(colour)
    .setTimestamp()
    .setDescription("Error!");

  return embed;
}
