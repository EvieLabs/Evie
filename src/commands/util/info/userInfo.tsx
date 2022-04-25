import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import MemberInfoComponent from "#root/components/info/MemberInfoComponent";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { ContextMenuInteraction, Message } from "discord.js";
import React from "react";

export class UserInfo extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "userinfo",
      aliases: ["ui"],
      description: "User Info",
      preconditions: ["GuildOnly"],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const member = await args.pick("member").catch(() => message.member);
    if (!member)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Failed to pick a member.",
        message
      );

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
        StatusEmoji.FAIL,
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
      }
    );
  }
}
