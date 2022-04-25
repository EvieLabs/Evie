import {
  EvieEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import { trimArray } from "#root/utils/builders/stringBuilder";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { time } from "@discordjs/builders";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { ContextMenuInteraction, GuildMember, Message } from "discord.js";

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
    return void this.sendUserInfo(message, member);
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

    return void this.sendUserInfo(interaction, member);
  }

  private sendUserInfo(
    interaction: ContextMenuInteraction<"cached"> | Message,
    member: GuildMember
  ) {
    const a = "➤";

    const { guild, user, joinedAt, displayName } = member;
    const { createdAt } = user;

    const embed = new EvieEmbed(interaction.guild)
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`${user.tag} (${user.id})`)
      .setDescription(
        `${a} **Known as**: ${displayName}
      ${a} **Created Account**: ${createdAt ? time(createdAt, "R") : "Unknown"}
        ${a} **Joined ${guild.name}**: ${
          joinedAt ? time(joinedAt, "R") : "Unknown"
        }`
      )
      .addField(
        "Roles",
        trimArray(member.roles.cache.map((r) => `${r}`)).join(", ")
      )
      .addField(
        "Permissions",
        this.capitalizeEachWord(
          trimArray(member.permissions.toArray())
            .join(", ")
            .replace(/\_/g, " ")
            .toLowerCase()
        )
      );
    interaction.reply({ embeds: [embed] });
  }

  private capitalizeEachWord(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
