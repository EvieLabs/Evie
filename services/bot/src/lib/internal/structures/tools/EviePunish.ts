import { ModActionType, OppositeModActionType } from "#root/Enums";
import { modActionDescription } from "#root/utils/builders/stringBuilder";
import { container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import { BanOptions, Guild, GuildMember, Snowflake, SnowflakeUtil, User } from "discord.js";
import { LogEmbed } from "../../extensions/LogEmbed";
export class EviePunish {
	public async createModAction(guild: Guild, options: ModActionOptions) {
		try {
			if (
				!(
					await container.client.prisma.moderationSettings.findFirst({
						where: {
							guildId: guild.id,
						},
					})
				)?.logChannel
			)
				return;

			await container.client.prisma.modAction
				.create({
					data: {
						id: SnowflakeUtil.generate(),
						guildId: guild.id,
						targetID: options.target.id,
						targetName: options.target.username,
						moderatorID: options.moderator?.id,
						moderatorName: options.moderator?.username,
						reason: options.reason ?? (await resolveKey(guild, "modules/punish:noReason")),
						typeId: options.type,
						type: options.action,
						expiresAt: options.expiresAt,
					},
				})
				.then(async (savedAction) => {
					const channel = await container.client.guildLogger.getModChannel(guild);

					const ogCaseAction = await this.findOriginalModAction(guild, options);

					await channel
						.send({
							embeds: [
								new LogEmbed(`moderation`)
									.setColor("#eb564b")
									.setAuthor({
										name: options.moderator
											? `${options.moderator.tag} (${options.moderator.id})`
											: `${
													container.client.user
														? container.client.user.tag
														: await resolveKey(guild, "modules/punish:me")
											  } (${
													container.client.user
														? container.client.user.id
														: await resolveKey(guild, "modules/punish:me")
											  })`,
									})
									.setDescription(
										modActionDescription(
											{
												...savedAction,
												target: options.target,
											},
											ogCaseAction
												? {
														action: ogCaseAction,
														channel,
												  }
												: undefined,
										),
									)
									.setFooter({
										text: savedAction.id,
									}),
							],
						})

						.then(async (msg) =>
							container.client.prisma.modAction.update({
								where: {
									id: savedAction.id,
								},
								data: {
									logMessageID: msg.id,
								},
							}),
						);
				});
		} catch (e) {
			Sentry.captureException(e);
		}
	}

	private async findOriginalModAction(guild: Guild, newOptions: ModActionOptions) {
		const oppositeAction = OppositeModActionType(newOptions.type);

		if (!oppositeAction) return null;

		const modAction = await container.client.prisma.modAction
			.findFirst({
				where: {
					targetID: newOptions.target.id,
					guildId: guild.id,
					typeId: oppositeAction,
				},
			})
			.catch((err) => {
				Sentry.captureException(err);
			});

		if (!modAction) return null;

		return modAction;
	}

	public async banGuildMember(member: GuildMember, banOptions: BanOptions, expiresAt?: Date, banner?: GuildMember) {
		await member.ban(banOptions).catch((err) => {
			throw err;
		});

		void this.createModAction(member.guild, {
			action: await resolveKey(member.guild, "modules/punish:ban"),
			type: ModActionType.Ban,
			target: member.user,
			moderator: banner?.user,
			reason: banOptions.reason,
			expiresAt: expiresAt,
		});

		return true;
	}

	public async unBanGuildMember(id: Snowflake, guild: Guild, reason: string, moderator?: GuildMember) {
		const user = await guild.bans.remove(id).catch((err) => {
			throw err;
		});

		if (user)
			void this.createModAction(guild, {
				action: await resolveKey(guild, "modules/punish:reverseBan"),
				type: ModActionType.Unban,
				target: user,
				moderator: moderator?.user ?? undefined,
				reason: moderator?.user ? reason : `${reason} ${await resolveKey(guild, "modules/punish:unknownMod")}`,
			});

		return user;
	}
}

export interface ModActionOptions {
	action?: string;
	type: ModActionType;
	target: User;
	moderator?: User;
	reason?: string;
	expiresAt?: Date;
}
