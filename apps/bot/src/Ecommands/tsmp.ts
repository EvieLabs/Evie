/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export {};
import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, GuildMember, Role } from "discord.js";
import fetch from "node-fetch";
import { EvieEmbed } from "#classes/EvieEmbed";
interface discordRes {
  discordId: string;
  error: boolean;
  discordTag: string;
  discordName: string;
  uuid: string;
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tsmp")
    .setDescription("TristanSMP Actions")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("accept")
        .setDescription("Accept a Player")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("Player to accept")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("revoke")
        .setDescription("Revoke a Player")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("Player to revoke")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("linked")
        .setDescription("Lookup a Minecraft Username")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("Minecraft Username")
            .setRequired(true)
        )
    ),

  async execute(i: CommandInteraction) {
    const subcommand = i.options.getSubcommand();
    if (subcommand == "accept") {
      if (!i.inGuild()) {
        return;
      }
      const mem: GuildMember = i.member! as GuildMember;
      if (!mem.roles.cache.has("925183963331457076")) {
        return i.reply({
          content: "You are not a staff member!",
          ephemeral: true,
        });
      }
      const m = i.options.getMember("player") as GuildMember;
      const r: Role = i.guild!.roles.cache.find(
        (r) => r.id == "878074525223378974"
      ) as Role;
      const e = await EvieEmbed(i.guild);
      const ji =
        "https://discord.com/channels/819106797028769844/819446614568599582/884646964074020905";
      e.setTitle("Accepted!");
      e.setDescription(
        `Good News! ${m} You were accepted by ${i.user}, you can read the join info [here](${ji}) if you don't know the server info yet.
             Anyways you must go onto the **Minecraft server** and type \`/discord link\` and dm the code to <@864676306662195200> so I can link your Minecraft Account with your Discord here`
      );
      e.addField(
        "Known Issue(s)",
        `* Running \`/discord link\` on Lunar Client makes you get the invite for the official Lunar Client Discord,
             just run the command on vanilla and come back if Lunar is your preferred way to play.`
      );
      e.addField(
        "Proximity Voice Chat",
        "To use Proximity Voice Chat in Game you don't need to do anything as it's all done in the Discord automatically by our bots, simply [read our blog post](https://www.tristansmp.com/blog/proximity) for more info :)"
      );
      e.addField(
        "Explore the Market",
        "On tsmp, there is an online market. This is where you can buy and sell items for Diamonds. For more info visit the [info page](https://tristansmp.com/info/markets)"
      );
      await m?.roles
        .add(r, `Accepted by ${i.user}`)
        .then(() => {
          i.reply({ embeds: [e], content: `${m} Good News!` });
        })
        .catch(() => {
          i.reply({ content: "Failed! Tell Tristan asap", ephemeral: true });
        });
    } else if (subcommand == "revoke") {
      if (!i.inGuild()) {
        return;
      }
      const mem: GuildMember = i.member! as GuildMember;
      if (!mem.roles.cache.has("819442569128706068")) {
        return i.reply({
          content: "You are not a staff member!",
          ephemeral: true,
        });
      }
      const m = i.options.getMember("user") as GuildMember;
      if (!m.roles.cache.has("878074525223378974")) {
        return i.reply({
          content: "You can only revoke players who have been accepted!",
          ephemeral: true,
        });
      }
      const r: Role = i.guild!.roles.cache.find(
        (r) => r.id == "878074525223378974"
      ) as Role;
      const br: Role = i.guild!.roles.cache.find(
        (r) => r.id == "904148775801585676"
      ) as Role;
      const e = await EvieEmbed(i.guild);

      e.setTitle("Revoked!");
      e.setDescription(
        `Oh no! ${m} You were revoked by ${i.user}, you can appeal later by making a ticket <#884223699778150400>`
      );

      await m?.roles
        .remove(r, `Revoked by ${i.user}`)
        .then(() => {
          m?.roles.add(br, `Revoked by ${i.user}`);
          i.reply({ embeds: [e], content: `${m} Oh!` });
        })
        .catch(() => {
          i.reply({ content: "Failed! Tell Tristan asap", ephemeral: true });
        });
    } else if (subcommand == "linked") {
      // fetch the username
      const username = i.options.getString("username");
      // fetch https://api.tristansmp.com/player/:username/discord
      const res: discordRes = await fetch(
        `https://api.tristansmp.com/players/username/${username}/discord`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
      // if theres no discord id
      if (!res.discordId) {
        return i.reply({
          content: "No Discord ID found!",
          ephemeral: true,
        });
      }
      // fetch the discord user
      const dUser = await i.client.users.fetch(res.discordId);
      // if theres no discord user
      if (!dUser) {
        return i.reply({
          content: "No Discord User found!",
          ephemeral: true,
        });
      }
      // send the discord user
      const e = await EvieEmbed(i.guild);
      e.setDescription(`${username} is linked to ${dUser}`);
      return i.reply({
        embeds: [e],
        ephemeral: true,
      });
    }
  },
};
