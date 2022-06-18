import { EvieColors } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import type { AstralPlayer } from "@astral/utils";
import { time } from "@discordjs/builders";
import { Embed } from "@evie/reacord";
import React from "react";

export default function PlayerStats(props: { player: AstralPlayer }) {
  const a = "➤";
  const { player } = props;
  const { guild, user, joinedAt, displayName } = player.member;
  const { createdAt } = user;

  return (
    <>
      <Embed
        color={EvieColors.evieGrey}
        thumbnail={{ url: user.displayAvatarURL() }}
        title={`${displayName}'s Astral Stats`}
        fields={[
          {
            name: "Level",
            value: `${player.level} (${player.xp} XP)`,
          },
        ]}
      >
        {removeIndents(`
        ${a} **Created Account**: ${
          createdAt ? time(createdAt, "R") : "Unknown"
        }
        ${a} **Joined ${guild.name}**: ${
          joinedAt ? time(joinedAt, "R") : "Unknown"
        }`)}
      </Embed>
    </>
  );
}
