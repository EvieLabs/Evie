import type { User } from "discord.js";

export const modAction = (member: User, action: string, reason?: string) => {
  return `**Member**: \`${member.tag}\` (${member.id})
          **Action**: ${action}
          **Reason**: ${reason ?? "No reason provided."}
         `;
};
