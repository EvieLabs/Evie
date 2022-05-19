import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { AuditLogEvent } from "discord-api-types/v9";
import { Constants, DiscordAPIError, GuildMember, User } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildMemberUpdate,
})
export class GuildMemberUpdateListener extends Listener {
  public async run(oldMember: GuildMember, { user, guild }: GuildMember) {
    try {
      const auditLogs = await guild.fetchAuditLogs({
        limit: 10,
        type: AuditLogEvent.MemberUpdate,
      });

      const log = auditLogs.entries.find(
        (log) =>
          ((log.target as User).id === oldMember.user.id &&
            log.changes?.some(
              (c) => c.key === "communication_disabled_until"
            )) ??
          false
      );

      if (!log) return;
      if (log.executor?.id == this.container.client.user?.id) return;

      if (!log?.changes) return;

      const timeoutUpdate = log.changes.find(
        (c) => c.key === "communication_disabled_until"
      );

      if (!timeoutUpdate) return;
      const timedOut = !Boolean(timeoutUpdate.old && !timeoutUpdate.new);
      if (!timedOut)
        return void this.container.client.guildLogger.modAction(guild, {
          action: "Un-timeout",
          target: user,
          moderator: log?.executor || undefined,
        });

      return void this.container.client.guildLogger.modAction(guild, {
        action: "Timeout",
        target: user,
        reason: log.reason ? log.reason : `No reason provided.`,
        moderator: log?.executor || undefined,
      });
    } catch (error) {
      if (!(error instanceof DiscordAPIError)) return captureException(error);

      if (error.code !== Constants.APIErrors.MISSING_PERMISSIONS) {
        return;
      }
      return;
    }
  }
}
