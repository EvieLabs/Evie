import { Button, Embed } from "#reacord/main";
import { EvieColors } from "#root/Enums";
import {
  constructMessageLink,
  removeIndents,
} from "#root/utils/builders/stringBuilder";
import { time } from "@discordjs/builders";
import type { ModAction } from "@prisma/client";
import { SnowflakeUtil, TextChannel, User } from "discord.js";
import React, { useState } from "react";

export default function CasesComponent(props: {
  user: User;
  cases: ModAction[];
  modLog: TextChannel;
}) {
  const { user, cases, modLog } = props;

  const casesFormatted = cases.map((case_) =>
    removeIndents(
      `**Case**: [#${case_.id}](${constructMessageLink(
        modLog,
        case_.logMessageID ?? case_.id
      )})
      **Reason**: ${case_.reason}
      ${`**Moderator**: ${case_.moderatorName ?? "Automated"} (\`${
        case_.moderatorID ?? "Automated"
      }\`)`}
      ${`**Target**: ${case_.targetName} (\`${case_.targetID}\`)`}
      ${`**Time**: ${time(SnowflakeUtil.deconstruct(case_.id).date)}`}`
    )
  );

  const [page, setPage] = useState<number>(0);

  return (
    <>
      <Embed
        color={EvieColors.evieGrey}
        description={
          casesFormatted.slice(page * 4, (page + 1) * 4).join("\n\n") +
          "\n" +
          `... and ${cases.length - (page + 1) * 4} more`
        }
      />
      <Button
        style="primary"
        user={user}
        label="<-"
        onClick={() => {
          setPage((page) => Math.max(0, page - 1));
        }}
      />
      <Button
        style="primary"
        user={user}
        label="->"
        onClick={() => {
          setPage((page) => Math.min(cases.length - 1, page + 1));
        }}
      />
    </>
  );
}
