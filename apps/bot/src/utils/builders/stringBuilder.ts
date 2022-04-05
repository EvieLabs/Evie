import type { GuildMember } from "discord.js";

export const modAction = (
  member: GuildMember,
  action: string,
  reason?: string
) => {
  return `**Member**: \`${member.user.tag}\` (${member.user.id})
          **Action**: ${action}
          **Reason**: ${reason ?? "No reason provided."}
         `;
};
