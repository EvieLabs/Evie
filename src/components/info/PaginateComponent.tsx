import { EvieColors } from "#root/Enums";
import { Button, Embed } from "@evie/reacord";
import type { User } from "discord.js";
import React, { useState } from "react";

export default function PaginateComponent(props: {
  user: User;
  blocks: string[];
}) {
  const { user, blocks } = props;

  const [page, setPage] = useState<number>(0);
  const BLOCKS_PER_PAGE = 4;

  return (
    <>
      <Embed
        color={EvieColors.evieGrey}
        description={blocks
          .slice(page * BLOCKS_PER_PAGE, (page + 1) * BLOCKS_PER_PAGE)
          .join("\n\n")}
        footer={{
          text: `Page ${page + 1} of ${Math.ceil(
            blocks.length / BLOCKS_PER_PAGE
          )}`,
        }}
      />
      {blocks.length > 4 && (
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
              setPage((page) => Math.min(blocks.length - 1, page + 1));
            }}
          />
        </>
      )}
    </>
  );
}
