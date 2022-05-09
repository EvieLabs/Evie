import lang from "#root/utils/lang";
import { checkPerm } from "#root/utils/misc/permChecks";
import { Precondition } from "@sapphire/framework";
import {
  CommandInteraction,
  GuildMember,
  Message,
  Permissions,
} from "discord.js";
export class ModOrBanPermsOnlyPrecondition extends Precondition {
  public override chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild())
      return this.error({
        message: lang.notInCachedGuild,
        context: { silent: true },
      });
    return this.checkPerm(interaction.member);
  }

  public override messageRun(message: Message) {
    return this.checkPerm(message.member);
  }

  private async checkPerm(member: GuildMember | null) {
    if (!member)
      return this.error({
        message:
          "This command can only be used by a moderator therefore it **must** be used in a guild, so how did we get here 🤷",
        context: { silent: true },
      });

    return (await checkPerm(member, Permissions.FLAGS.BAN_MEMBERS)) ||
      (await this.container.client.db.HasModRole(member))
      ? this.ok()
      : this.error({
          message: lang.commandModeratorOnly,
          context: { silent: true },
        });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    ModOrBanPermsOnly: never;
  }
}
