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

import { EvieEmbed, StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type {
  CommandInteraction,
  ContextMenuInteraction,
  GuildMember,
} from "discord.js";

const TSMPRoles = {
  blacklisted: "952828729103634452",
  member: "952065595262779392",
};

export class TSMP extends Command {
  public override async chatInputRun(i: CommandInteraction) {
    if (!i.inCachedGuild()) return;
    if (!process.env.TSMP_STAFF_ROLE_ID) return;

    const mem: GuildMember = i.member;
    if (!mem.roles.cache.has(process.env.TSMP_STAFF_ROLE_ID))
      return StatusEmbed(StatusEmoji.FAIL, "You are not TSMP Staff", i);

    const user = i.options.getMember("player");

    if (!user) {
      await StatusEmbed(StatusEmoji.FAIL, "You must specify a user to ban.", i);
      return;
    }

    this.acceptMember(i, user);
  }

  public override async contextMenuRun(i: ContextMenuInteraction) {
    if (!i.inCachedGuild()) return;
    if (!process.env.TSMP_STAFF_ROLE_ID) return;

    const mem: GuildMember = i.member;
    if (!mem.roles.cache.has(process.env.TSMP_STAFF_ROLE_ID))
      return StatusEmbed(StatusEmoji.FAIL, "You are not TSMP Staff", i);

    const user = i.options.getMember("user");

    if (!user) {
      await StatusEmbed(StatusEmoji.FAIL, "You must specify a user to ban.", i);
      return;
    }

    this.acceptMember(i, user);
  }

  private async acceptMember(
    i: ContextMenuInteraction | CommandInteraction,
    m: GuildMember
  ) {
    if (!i.inCachedGuild()) return;

    if (m.roles.cache.has(TSMPRoles.blacklisted)) {
      await m?.roles.remove(TSMPRoles.blacklisted, `Re-accept by ${i.user}`);
    }

    const r = await i.guild.roles.fetch(TSMPRoles.member);

    if (!r)
      return StatusEmbed(StatusEmoji.FAIL, "Could not find member role", i);

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
      "Explore the Market",
      "On tsmp, there is an online market. This is where you can buy and sell items for Diamonds. For more info visit the [info page](https://tristansmp.com/info/markets)"
    );

    await m?.roles
      .add(r, `Accepted by ${i.user}`)
      .then(() => {
        i.reply({ embeds: [e], content: `${m} Good News!` });
      })
      .catch(() => {
        StatusEmbed(StatusEmoji.FAIL, "Failed to add member role", i);
      });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("Accept Player")
          .setType(ApplicationCommandType.User),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );

    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription("Tristan SMP related commands.")
          .addSubcommand((subcommand) =>
            subcommand
              .setName("accept")
              .setDescription("Accept a player into the SMP.")
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
              .setDescription("Revoke a player from the SMP.")
              .addUserOption((option) =>
                option
                  .setName("player")
                  .setDescription("Player to revoke")
                  .setRequired(true)
              )
          ),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
