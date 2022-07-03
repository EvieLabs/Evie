import { Emojis } from "#root/Enums";
import { inlineCode, time } from "@discordjs/builders";
import { lang, registeredGuilds } from "@evie/config";
import { EvieEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Args,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import {
  CommandInteraction,
  Invite,
  Message,
  PartialGroupDMChannel,
} from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Fetch information for a server invite.",
  name: "inviteinfo",
  aliases: ["ii", "invite"],
  preconditions: ["GuildOnly"],
})
export class InviteInfo extends Command {
  public override async messageRun(message: Message, args: Args) {
    const invite = await args.pick("string").catch(() => null);

    if (!invite) throw "Failed to pick an invite.";

    const inviteInfo = await message.client
      .fetchInvite(invite)
      .catch(() => null);

    if (!inviteInfo) throw "Failed to fetch invite info.";

    return void (await message.reply(await this.getInviteInfo(inviteInfo)));
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const invite = interaction.options.getString("invite");

    if (!invite) throw "Failed to pick an invite.";

    const inviteInfo = await interaction.client
      .fetchInvite(invite)
      .catch(() => null);

    if (!inviteInfo) throw "Failed to fetch invite info.";

    const ephemeral = interaction.options.getBoolean("hide") ?? false;

    await interaction.deferReply({ ephemeral });

    return void (await interaction.editReply(
      await this.getInviteInfo(inviteInfo)
    ));
  }

  private async getInviteInfo(invite: Invite) {
    const { guild, channel } = invite;

    if (!guild || channel instanceof PartialGroupDMChannel)
      throw "Failed to fetch invite info.";

    const inviteInfo: string[] = [];

    inviteInfo.push(
      `Created invite: ${
        invite.createdAt ? time(invite.createdAt, "R") : "Unknown"
      }`
    );

    inviteInfo.push(`Channel name: ${channel.name}`);

    inviteInfo.push(`Channel type: ${inlineCode(channel.type)}`);

    inviteInfo.push(
      `Expires: ${invite.expiresAt ? time(invite.expiresAt, "R") : "Never"}`
    );

    inviteInfo.push(
      `Max uses: ${invite.maxUses ? invite.maxUses : "Unlimited"}`
    );

    inviteInfo.push(
      `Inviter: ${
        invite.inviter
          ? `${invite.inviter.tag} (${invite.inviter.id})`
          : "Unknown"
      }`
    );

    const guildInfo: string[] = [];

    guildInfo.push(`Created server: ${time(guild.createdAt, "R")}`);

    guildInfo.push(`Name: ${guild.name}`);

    guildInfo.push(`NSFW level: ${inlineCode(guild.nsfwLevel)}`);

    guildInfo.push(
      `Verification level: ${inlineCode(guild.verificationLevel)}`
    );

    const embed = new EvieEmbed().setTitle(guild.name).setFields([
      {
        name: "Invite Info",
        value: inviteInfo
          .map((line) => `${Emojis.bulletPoint} ${line}`)
          .join("\n"),
      },
      {
        name: "Server Info",
        value: guildInfo
          .map((line) => `${Emojis.bulletPoint} ${line}`)
          .join("\n"),
      },
    ]);

    if (guild.description) embed.setDescription(guild.description);

    const splash = guild.splashURL();

    if (splash) embed.setThumbnail(splash);

    return { embeds: [embed] };
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
            name: "invite",
            description:
              "The invite to fetch information for. (e.g. discord.gg/discord-townhall, discord-townhall)",
            type: "STRING",
            required: true,
          },
          {
            name: lang.HIDE_COMMAND_OPTION_NAME,
            description: lang.HIDE_COMMAND_OPTION_DESCRIPTION,
            type: "BOOLEAN",
            required: false,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
