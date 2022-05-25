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
  const CASES_PER_PAGE = 4;

  return (
    <>
      <Embed
        color={EvieColors.evieGrey}
        description={casesFormatted
          .slice(page * CASES_PER_PAGE, (page + 1) * CASES_PER_PAGE)
          .join("\n\n")}
        footer={{
          text: `Page ${page + 1} of ${Math.ceil(
            cases.length / CASES_PER_PAGE
          )}`,
        }}
      />
      {cases.length > 4 && (
        <>
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
      )}
    </>
  );
}
