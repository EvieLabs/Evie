import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { AuditLogEvent } from "discord-api-types/v9";
import { Constants, DiscordAPIError, GuildMember, User } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildMemberRemove,
})
export class GuildKickListener extends Listener {
  public async run({ guild, user }: GuildMember) {
    try {
      const auditLogs = await guild.fetchAuditLogs({
        limit: 10,
        type: AuditLogEvent.MemberKick,
      });
      const log = auditLogs.entries.find(
        (log) => (log.target as User).id === user.id
      );
      if (!log) return;
      if (log.executor?.id == this.container.client.user?.id) return;

      return void this.container.client.punishments.createModAction(guild, {
        action: "Manual Kick (Not via Evie)",
        target: user,
        reason: log.reason ? log.reason : `No reason provided.`,
        moderator: log?.executor || undefined,
      });
    } catch (error) {
      if (!(error instanceof DiscordAPIError)) return captureException(error);

      if (error.code !== Constants.APIErrors.MISSING_PERMISSIONS) {
        return;
      }
      return captureException(error);
    }
  }
}
