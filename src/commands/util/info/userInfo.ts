import {
  EvieEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import type { ContextMenuInteraction } from "discord.js";

export class UserInfo extends Command {
  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    if (!interaction.inCachedGuild()) return;

    const member = interaction.options.getMember("user");

    if (!member) {
      ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Please provide a valid user.",
        interaction
      );
      return;
    }

    const embed = await EvieEmbed(interaction.guild);
    embed.setTitle(`Member Info for ${member.user.tag}`);
    embed.setThumbnail(member.user.displayAvatarURL());
    embed.addField("User", `${member.user.tag} (${member.user.id})`);
    embed.addField("Nickname", member.nickname || "None");
    embed.addField(
      `Joined ${member.guild.name}`,
      member.joinedAt ? member.joinedAt.toLocaleString() : "Unknown"
    );
    embed.addField(
      `Created Account`,
      member.user.createdAt ? member.user.createdAt.toLocaleString() : "Unknown"
    );
    embed.addField("Bot", member.user.bot ? "Yes" : "No");
    embed.addField("Roles", member.roles.cache.map((r) => r).join(", "));
    embed.addField(
      "Permissions",
      this.capitalizeEachWord(
        member.permissions
          .toArray()
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
