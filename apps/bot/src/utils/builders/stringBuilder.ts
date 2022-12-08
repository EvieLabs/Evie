import { time } from "@discordjs/builders";
import type { ModAction } from "@prisma/client";
import type { Snowflake, TextChannel, User } from "discord.js";

export function constructMessageLink(channel: TextChannel, messageID: Snowflake) {
	return `https://discord.com/channels/${channel.guildId}/${channel.id}/${messageID}`;
}

export function trimArray(array: string[], maxLength = 10) {
	if (array.length > maxLength) {
		return array.slice(0, maxLength).concat(`... and ${array.length - maxLength} more`);
	}
	return array;
}

export function removeIndents(str: string) {
	return str.replace(/^\s+/gm, "");
}

export function capitalizeEachWord(str: string) {
	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function pluralize(str: string, count: number) {
	if (count === 1) {
		return str;
	}
	return `${str}s`;
}

export const modActionDescription = (
	action: ModAction & {
		target: User;
	},
	ogCase?: {
		action: ModAction;
		channel: TextChannel;
	},
) => {
	ogCase;
	return removeIndents(`
          **Member**: \`${action.target.tag}\` (${action.target.id})
          **Action**: ${action.type ?? "Unknown"}
          ${action.reason ? `**Reason**: ${action.reason}` : ""}
          ${action.expiresAt ? `**Expires**: ${time(action.expiresAt, "R")}` : ""}
          ${
						ogCase?.action.logMessageID
							? `**Reference**: [#${ogCase.action.id}](${constructMessageLink(
									ogCase.channel,
									ogCase.action.logMessageID,
							  )})`
							: ""
					}
         `);
};

export const botInvite = (id: Snowflake, scopes: string[] = ["bot"]) =>
	`https://discord.com/oauth2/authorize?client_id=${id}&scope=${scopes.join("%20")}`;
