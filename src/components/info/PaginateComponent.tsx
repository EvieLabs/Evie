import { EvieColors } from "#root/Enums";
import { Button, Embed } from "@evie/reacord";
import type { User } from "discord.js";
import React, { useState } from "react";

export default function PaginateComponent(props: {
  user: User;
  pages: {
    title?: string;
    description: string;
    color?: number;
  }[];
}) {
  const { user, pages } = props;

  const [page, setPage] = useState<typeof pages[number]>(pages[0]);

  return (
    <>
      <Embed
        color={page.color ?? EvieColors.evieGrey}
        title={page.title}
        description={page.description}
        footer={{
          text: `Page ${pages.indexOf(page) + 1}/${pages.length}`,
        }}
      />
      {pages.length > 4 && (
        <>
          <Button
            style="primary"
            disabled={pages.indexOf(page) === 0}
            user={user}
            label="<-"
            onClick={() => {
              setPage(pages[pages.indexOf(page) - 1]);
            }}
          />
          <Button
            style="primary"
            disabled={pages.indexOf(page) === pages.length - 1}
            user={user}
            label="->"
            onClick={() => {
              setPage(pages[pages.indexOf(page) + 1]);
            }}
          />
        </>
      )}
    </>
  );
}
