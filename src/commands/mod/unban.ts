import {
  EditReplyStatusEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
import { checkPerm } from "#root/utils/misc/permChecks";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import {
  AutocompleteInteraction,
  CommandInteraction,
  Permissions,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Un-ban a user",
  preconditions: ["ModOrBanPermsOnly"],
})
export class UnBan extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const target = interaction.options.getString("user");
    const reason = interaction.options.getString("reason");

    if (!target) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You must specify a user to ban.",
        interaction
      );
      return;
    }

    await interaction.deferReply();

    try {
      const user = await interaction.client.punishments.unBanGuildMember(
        target,
        interaction.guild,
        reason ?? "No reason provided.",
        interaction.member
      );

      await EditReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `Successfully unbanned ${user?.username}#${user?.discriminator}`,
        interaction
      );
      return;
    } catch (e) {
      Sentry.captureException(e);
      EditReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Failed to un-ban user.",
        interaction
      );
      return;
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
      return await interaction.respond([
        {
          name: "Hey you don't have the required permissions to un-ban users.",
          value: "notadmin",
        },
      ]);
    }

    const bans = await interaction.guild.bans.fetch();
    const query = interaction.options.getString("query") ?? "";

    if (bans.size == 0) {
      return await interaction.respond([
        {
          name: "No bans found. Must be nice.",
          value: "nobans",
        },
      ]);
    }

    const sortedBans = bans
      .filter(
        (ban) =>
          ban.user.tag.toLowerCase().includes(query.toLowerCase()) ||
          ban.user.id.includes(query.toLowerCase())
      )
      .sort((a, b) => a.user.tag.localeCompare(b.user.tag));

    return await interaction.respond(
      sortedBans.map((ban) => {
        return {
          name: `🚫${ban.user.username}#${ban.user.discriminator}`,
          value: ban.user.id,
        };
      })
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "user",
            description: "The user to un-ban",
            type: "STRING",
            required: true,
            autocomplete: true,
          },
          {
            name: "reason",
            description: "The reason for un-banning the user",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954566055328612352"],
      }
    );
  }
}
