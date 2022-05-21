import { time } from "@discordjs/builders";
import type { ModAction } from "@prisma/client";
import type { User } from "discord.js";

export const modActionDescription = (
  action: ModAction & {
    target: User;
  }
) => {
  return `**Member**: \`${action.target.tag}\` (${action.target.id})
          **Action**: ${action.type}
          ${action.reason ? `**Reason**: ${action.reason}` : ""}
          ${
            action.expiresAt
              ? `**Expires**: ${time(action.expiresAt, "R")}`
              : ""
          }
         `;
};

export function trimArray(a: string[], b = 10) {
  if (a.length > b) {
    const c = a.length - b;
    (a = a.slice(0, b)), a.push(`${c} more...`);
  }
  return a;
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
