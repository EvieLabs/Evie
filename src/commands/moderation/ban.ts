import {
  EditReplyStatusEmbed,
  ReplyStatusEmbed,
} from "#root/classes/EvieEmbed";
import { checkPerm } from "#root/utils/misc/permChecks";
import { time } from "@discordjs/builders";
import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import {
  AutocompleteInteraction,
  CommandInteraction,
  Permissions,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Ban a user",
  preconditions: ["ModOrBanPermsOnly"],
  requiredClientPermissions: ["BAN_MEMBERS"],
})
export class Ban extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const userToBeBanned = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const days = interaction.options.getString("days");
    const show = !interaction.options.getBoolean("show") ?? false;

    const expiresAt = days
      ? new Date(Date.now() + parseInt(days) * 86400000)
      : undefined;

    if (!userToBeBanned) {
      await ReplyStatusEmbed(
        false,
        "You must specify a user to ban.",
        interaction
      );
      return;
    }

    await interaction.deferReply({ ephemeral: show });

    try {
      await interaction.client.punishments.banGuildMember(
        userToBeBanned,
        {
          reason: reason ?? "No reason provided.",
        },
        expiresAt,
        interaction.member
      );
      await EditReplyStatusEmbed(
        true,
        `Banned ${userToBeBanned} (${userToBeBanned.id}) ${
          expiresAt ? time(expiresAt, "R") : `indefinitely`
        } for \`${reason ?? "no reason :("}\`.`,
        interaction
      );
      return;
    } catch (e) {
      Sentry.captureException(e);
      console.log(e);
      EditReplyStatusEmbed(false, "Failed to ban user.", interaction);
      return;
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!(await checkPerm(interaction.member, Permissions.FLAGS.BAN_MEMBERS))) {
      return await interaction.respond([
        {
          name: await resolveKey(interaction.guild, "permissions:mod"),
          value: "notadmin",
        },
      ]);
    }

    const query = interaction.options.getString("days") ?? "0";

    // when theres no query show some suggestions such as 5 Days, 1 Day, etc.
    if (!query) {
      return await interaction.respond([
        {
          name: "24 Hours",
          value: `${1}`,
        },
        {
          name: "3 Day",
          value: `${3}`,
        },
        {
          name: "1 Week",
          value: `${7}`,
        },
        {
          name: "1 Month",
          value: `${30}`,
        },
        {
          name: "1 Year",
          value: `${365}`,
        },
      ]);
    } else {
      const days = parseInt(query);

      if (days === 0) {
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
            value: `${days}`,
          },
          {
            name: `${days} Weeks`,
            value: `${days * 7}`,
          },
          {
            name: `${days} Months`,
            value: `${days * 30}`,
          },
          {
            name: `${days} Years`,
            value: `${days * 365}`,
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
        description: this.description,
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
            type: "STRING",
            required: false,
            autocomplete: true,
          },
          {
            name: "reason",
            description: "Reason for the ban",
            type: "STRING",
            required: false,
          },
          {
            name: "show",
            description: "Send the message non-ephemerally",
            type: "BOOLEAN",
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
