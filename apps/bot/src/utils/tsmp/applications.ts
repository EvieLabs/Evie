import type { GuildMember, OverwriteResolvable } from "discord.js";

export async function makeApplicationChannel(applicant: GuildMember) {
  if (!applicant.guild) throw new Error("Applicant is not in a guild");

  const username =
    applicant.user.username.length > 30
      ? applicant.user.username.slice(0, 30) + "..."
      : applicant.user.username;

  const perms: OverwriteResolvable[] = [
    {
      id: applicant.guild.id,
      deny: ["VIEW_CHANNEL"],
    },
    {
      id: applicant.id,
      allow: ["VIEW_CHANNEL"],
    },
  ];

  if (process.env.TSMP_STAFF_ROLE_ID) {
    perms.push({
      // Application Reviewers
      id: process.env.TSMP_STAFF_ROLE_ID,
      allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"],
    });
  }

  if (applicant.guild.me) {
    perms.push({
      // Me
      id: applicant.guild.me.id,
      allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"],
    });
  }

  if (process.env.TSMP_GUILD_ID == "952064632187658261") {
    perms.push({
      // Natsirt
      id: "864676306662195200",
      allow: ["VIEW_CHANNEL"],
    });
  }

  return await applicant.guild.channels.create(`${username}-application`, {
    type: "GUILD_TEXT",
    parent: process.env.TSMP_APPLICATIONS_CATEGORY_ID,
    permissionOverwrites: perms,
    reason: "New Application",
    topic: `Application for ${applicant.user.username}`,
    nsfw: false,
    rateLimitPerUser: 0,
    position: 0,
  });
}
