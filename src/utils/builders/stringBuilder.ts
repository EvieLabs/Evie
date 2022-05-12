import type { User } from "discord.js";

export const modAction = (member: User, action: string, reason?: string) => {
  return `**Member**: \`${member.tag}\` (${member.id})
          **Action**: ${action}
          **Reason**: ${reason ?? "No reason provided."}
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
