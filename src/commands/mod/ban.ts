import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { modDB } from "#root/utils/database/modSettings";
import { punishDB } from "#root/utils/database/punishments";
import { checkPerm } from "#root/utils/misc/permChecks";
import { registeredGuilds } from "#utils/parsers/envUtils";
import { time } from "@discordjs/builders";
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

export class Ban extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (
      !(
        (await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS)) ||
        (await modDB.hasModRole(interaction.member))
      )
    ) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You do not have the required permissions to ban users.",
        interaction
      );
      return;
    }
    const userToBeBanned = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const days = interaction.options.getNumber("days");
    const expiresAt = days ? new Date(Date.now() + days * 86400000) : undefined;

    if (!userToBeBanned) {
      await ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "You must specify a user to ban.",
        interaction
      );
      return;
    }

    if (await punishDB.getBan(userToBeBanned)) {
      await punishDB.deleteBan(userToBeBanned.id, interaction.guild);
    }

    try {
      await interaction.client.punishments.banGuildMember(
        userToBeBanned,
        {
          reason: reason ?? "No reason provided.",
        },
        expiresAt,
        interaction.member
      );
      await ReplyStatusEmbed(
        StatusEmoji.SUCCESS,
        `Banned ${userToBeBanned} (${userToBeBanned.id}) ${
          expiresAt ? time(expiresAt, "R") : `indefinitely`
        } for \`${reason ?? "no reason :("}\`.`,
        interaction
      );
      return;
    } catch (e) {
      Sentry.captureException(e);
      ReplyStatusEmbed(StatusEmoji.FAIL, "Failed to ban user.", interaction);
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

    const query = interaction.options.getNumber("days") ?? "";

    // when theres no query show some suggestions such as 5 Days, 1 Day, etc.
    if (!query) {
      return await interaction.respond([
        {
          name: "24 Hours",
          value: 1,
        },
        {
          name: "3 Day",
          value: 3,
        },
        {
          name: "1 Week",
          value: 7,
        },
        {
          name: "1 Month",
          value: 30,
        },
        {
          name: "1 Year",
          value: 365,
        },
      ]);
    } else {
      // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string'.
      const days = parseInt(query);
      if (isNaN(days)) {
        return await interaction.respond([
          {
            name: "Invalid number.",
            value: "invalid",
          },
        ]);
      } else {
        return await interaction.respond([
          {
            name: `${days} Days`,
            value: days,
          },
          {
            name: `${days} Weeks`,
            value: days * 7,
          },
          {
            name: `${days} Months`,
            value: days * 30,
          },
          {
            name: `${days} Years`,
            value: days * 365,
          },
        ]);
      }
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: "Ban a user",
        options: [
          {
            name: "user",
            description: "The user to ban",
            type: "USER",
            required: true,
          },
          {
            name: "days",
            description: "Days to ban the user for",
            type: "NUMBER",
            required: false,
            autocomplete: true,
          },
          {
            name: "reason",
            description: "Reason for the ban",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954547077994655785"],
      }
    );
  }
}
