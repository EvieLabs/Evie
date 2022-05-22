import { time } from "@discordjs/builders";
import type { ModAction } from "@prisma/client";
import type { Snowflake, TextChannel, User } from "discord.js";

export const modActionDescription = (
  action: ModAction & {
    target: User;
  },
  ogCase?: {
    action: ModAction;
    channel: TextChannel;
  }
) => {
  ogCase;
  return removeIndents(`
          **Member**: \`${action.target.tag}\` (${action.target.id})
          **Action**: ${action.type}
          ${action.reason ? `**Reason**: ${action.reason}` : ""}
          ${
            action.expiresAt
              ? `**Expires**: ${time(action.expiresAt, "R")}`
              : ""
          }
          ${
            ogCase?.action.logMessageID
              ? `**Reference**: [#${ogCase.action.id}](${constructMessageLink(
                  ogCase.channel,
                  ogCase.action.logMessageID
                )})`
              : ""
          }
         `);
};

export function constructMessageLink(
  channel: TextChannel,
  messageID: Snowflake
) {
  return `https://discord.com/channels/${channel.guildId}/${channel.id}/${messageID}`;
}

export function trimArray(a: string[], b = 10) {
  if (a.length > b) {
    const c = a.length - b;
    (a = a.slice(0, b)), a.push(`${c} more...`);
  }
  return a;
}

export function removeIndents(str: string) {
  return str.replace(/^\s+/gm, "");
}

export function capitalizeEachWord(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function pluralize(str: string, count: number) {
  if (count === 1) {
    return str;
  }
  return `${str}s`;
}
