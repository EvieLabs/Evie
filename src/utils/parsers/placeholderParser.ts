import type { GuildMember } from "discord.js";

export default async function placeholderParser(
  input: string,
  member: GuildMember
) {
  input = input.replace("${mentionUser}", `<@${member.user.id}>`);
  input = input.replace("${displayName}", member.user.username);

  return input;
}
