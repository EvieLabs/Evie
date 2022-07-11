import { GuildMember, Permissions } from "discord.js";

export class Gate {
  public canManageGuildConf(member: GuildMember) {
    if (member.id === member.guild.ownerId) return true;
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return true;
    if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return true;

    return false;
  }
}
