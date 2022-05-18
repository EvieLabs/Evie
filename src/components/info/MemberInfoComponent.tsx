import { Embed } from "#reacord/main";
import { colors } from "#root/constants/config";
import { capitalizeEachWord, trimArray } from "#utils/builders/stringBuilder";
import { time } from "@discordjs/builders";
import type { GuildMember } from "discord.js";
import React from "react";

export default function MemberInfoComponent(props: { member: GuildMember }) {
  const a = "➤";
  const { member } = props;
  const { guild, user, joinedAt, displayName } = member;
  const { createdAt } = user;

  return (
    <>
      <Embed
        color={colors.evieGrey}
        thumbnail={{ url: user.displayAvatarURL() }}
        title={`${user.tag} (${user.id})`}
        fields={[
          {
            name: "Roles",
            value: trimArray(member.roles.cache.map((r) => `${r}`)).join(", "),
          },
          {
            name: "Permissions",
            value: capitalizeEachWord(
              trimArray(member.permissions.toArray())
                .join(", ")
                .replace(/\_/g, " ")
                .toLowerCase()
            ),
          },
        ]}
      >
        {`${a} **Known as**: ${displayName}
      ${a} **Created Account**: ${createdAt ? time(createdAt, "R") : "Unknown"}
        ${a} **Joined ${guild.name}**: ${
          joinedAt ? time(joinedAt, "R") : "Unknown"
        }`}
      </Embed>
    </>
  );
}
