import { Emojis, EvieColors } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { Embed, Option, Select } from "@evie/reacord";
import type { GuildMember } from "discord.js";
import React from "react";

export type SelectRole = {
  name: string;
  id: string;
  emoji: string;
  description: string | undefined;
};

export default function RoleMenu(props: {
  member: GuildMember;
  roles: SelectRole[];
  roleDivider?: string;
}) {
  const { member, roles } = props;

  return (
    <>
      <Embed color={EvieColors.evieGrey} description="Toggle your roles:" />
      <Select
        user={member.user}
        onChangeValue={async (value, interaction) => {
          if (props.roleDivider && !member.roles.cache.has(props.roleDivider)) {
            await member.roles.add(props.roleDivider);
          }

          member.roles.cache.has(value)
            ? await member.roles.remove(value)
            : await member.roles.add(value);

          interaction.ephemeralReply(
            <Embed
              color={EvieColors.evieGrey}
              description={roles
                .map((role) =>
                  removeIndents(
                    `${role.emoji} ${role.name}: ${
                      member.roles.cache.has(role.id)
                        ? Emojis.enabled
                        : Emojis.disabled
                    }`
                  )
                )
                .join("\n")}
            />
          );
        }}
      >
        {roles.map((role) => (
          <Option
            key={role.id}
            value={role.id}
            label={role.name}
            description={role.description}
            emoji={role.emoji}
          />
        ))}
      </Select>
    </>
  );
}
