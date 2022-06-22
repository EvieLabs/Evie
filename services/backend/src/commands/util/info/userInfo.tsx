import { ReplyStatusEmbed } from "#root/classes/EvieEmbed";
import MemberInfoComponent from "#root/components/info/MemberInfoComponent";
import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { ContextMenuInteraction, Message } from "discord.js";
import React from "react";
@ApplyOptions<Command.Options>({
  description: "View info on a user",
  name: "userinfo",
  aliases: ["ui"],
  preconditions: ["GuildOnly"],
})
export class UserInfo extends Command {
  public override async messageRun(message: Message, args: Args) {
    const member = await args.pick("member").catch(() => message.member);
    if (!member)
      return void ReplyStatusEmbed(false, "Failed to pick a member.", message);

    return void message.client.reacord.send(
      message.channelId,
      <MemberInfoComponent member={member} />
    );
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild()) return;

    const member = interaction.options.getMember("user");

    if (!member)
      return void ReplyStatusEmbed(
        false,
        "Failed to pick a member.",
        interaction
      );

    return void interaction.client.reacord.reply(
      interaction,
      <MemberInfoComponent member={member} />
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName("User Info")
          .setType(ApplicationCommandType.User),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["962564724904591440"],
      }
    );
  }
}
