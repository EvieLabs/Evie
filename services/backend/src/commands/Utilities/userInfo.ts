import { EvieEmbed } from "#root/classes/EvieEmbed";
import { Emojis } from "#root/Enums";
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
import { ApplicationCommandType } from "discord-api-types/v9";
import {
  ContextMenuInteraction,
  GuildMember,
  Message,
  SnowflakeUtil,
  User,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "View an overview of a user.",
  name: "userinfo",
  aliases: ["ui", "user"],
  preconditions: ["GuildOnly"],
})
export class UserInfo extends Command {
  public override async messageRun(message: Message, args: Args) {
    const member = await args.pick("member").catch(async () => {
      const snowflake = await args.pick("string").catch(() => null);
      if (!snowflake) return message.member;
      return await message.client.users.fetch(snowflake).catch(() => null);
    });

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
    user: GuildMember | User
  ) {
    const badges = await EvieUser.getBadges(
      user instanceof User ? user : user.user
    ).catch(() => "");

    const description: string[] = [];

    if (user instanceof GuildMember) {
      description.push(`Known as: ${user.displayName}`);
      description.push(
        `Joined ${user.guild.name}: ${
          user.joinedAt ? time(user.joinedAt, "R") : "Unknown"
        }`
      );
    }

    const createdAt = SnowflakeUtil.deconstruct(user.id).date;

    description.push(
      `Created Account: ${createdAt ? time(createdAt, "R") : "Unknown"}`
    );

    const tag = user instanceof User ? user.tag : user.user.tag;

    const embed = new EvieEmbed()
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`${tag} (${user.id})`).setDescription(`
        ${badges}
        ${description.map((line) => `${Emojis.bulletPoint} ${line}`).join("\n")}
        `);

    user instanceof GuildMember &&
      embed.addFields([
        {
          name: "Roles",
          value: trimArray(user.roles.cache.map((r) => `${r}`)).join(", "),
        },
        {
          name: "Permissions",
          value: capitalizeEachWord(
            trimArray(user.permissions.toArray())
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
