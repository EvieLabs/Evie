import { ModActionType } from "#root/Enums";
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
	public async run(
		oldMember: GuildMember,
		{ user, guild, communicationDisabledUntil, communicationDisabledUntilTimestamp }: GuildMember,
	) {
		if (
			(communicationDisabledUntilTimestamp ? communicationDisabledUntilTimestamp < Date.now() : false) ||
			oldMember.communicationDisabledUntilTimestamp === communicationDisabledUntilTimestamp
		)
			return;

		try {
			const auditLogs = await guild.fetchAuditLogs({
				limit: 10,
				type: AuditLogEvent.MemberUpdate,
			});

			const log = auditLogs.entries.find(
				(log) =>
					((log.target as User).id === oldMember.user.id &&
						log.changes.some((c) => c.key === "communication_disabled_until")) ||
					false,
			);

			if (!log) return;
			if (log.executor?.id === this.container.client.user?.id) return;

			const timeoutUpdate = log.changes.find((c) => c.key === "communication_disabled_until");

			if (!timeoutUpdate) return;
			const timedOut = !(timeoutUpdate.old && !timeoutUpdate.new);
			if (!timedOut)
				return void this.container.client.punishments.createModAction(guild, {
					action: "Un-timeout",
					type: ModActionType.UnTimeout,
					target: user,
					moderator: log.executor ?? undefined,
				});

			return void this.container.client.punishments.createModAction(guild, {
				action: "Timeout",
				type: ModActionType.Timeout,
				target: user,
				reason: log.reason ? log.reason : `No reason provided.`,
				moderator: log.executor ?? undefined,
				expiresAt: communicationDisabledUntil ?? undefined,
			});
		} catch (error) {
			if (!(error instanceof DiscordAPIError)) return captureException(error);

			if (error.code === Constants.APIErrors.MISSING_PERMISSIONS) return;

			return captureException(error);
		}
	}
}
