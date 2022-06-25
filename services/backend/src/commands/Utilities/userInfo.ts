import { EvieEmbed } from "#root/classes/EvieEmbed";
import {
  capitalizeEachWord,
  trimArray,
} from "#root/utils/builders/stringBuilder";
import { time } from "@discordjs/builders";
import { registeredGuilds } from "@evie/config";
import { EvieUser } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { User } from "@sentry/node";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuInteraction, GuildMember, Message } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "View info on a user",
  name: "userinfo",
  aliases: ["ui"],
  preconditions: ["GuildOnly"],
})
export class UserInfo extends Command {
  public override async messageRun(message: Message, args: Args) {
    const member = await args.pick("member").catch(() => message.member);
    if (!member) throw "Failed to pick a member.";

    return void this.sendUserInfo(message, member);
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild())
      throw await resolveKey(interaction, "errors:notInCachedGuild");

    const user =
      interaction.options.getMember("user") ??
      interaction.options.getUser("user");

    if (!user) throw "Failed to pick a user.";

    return void this.sendUserInfo(interaction, user);
  }

  private async sendUserInfo(
    interaction: ContextMenuInteraction<"cached"> | Message,
    member: GuildMember | User
  ) {
    const a = "➤";

    const { guild, user, joinedAt, displayName } = member;
    const { badges } = await EvieUser.fetch(user).catch((e) => {
      throw e;
    });
    const { createdAt } = user;

    const embed = new EvieEmbed()
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`${user.tag} (${user.id})`)
      .setDescription(
        `${badges}
        ${a} **Known as**: ${displayName}
         ${a} **Created Account**: ${
          createdAt ? time(createdAt, "R") : "Unknown"
        }
         ${a} **Joined ${guild.name}**: ${
          joinedAt ? time(joinedAt, "R") : "Unknown"
        }`
      );

    member instanceof GuildMember &&
      embed.addFields([
        {
          name: "Roles",
          value: trimArray(member.roles.cache.map((r) => `${r}`)).join(", "),
        },
        {
          name: "Permissions",
          value: capitalizeEachWord(
            trimArray(member.permissions.toArray())
              .join(", ")
              .replace(/\_/g, " ")
              .toLowerCase()
          ),
        },
      ]);

    interaction.reply({ embeds: [embed] });
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
