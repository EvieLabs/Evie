import { EvieColors } from "#root/Enums";
import { Embed, Option, Select } from "@evie/reacord";
import { container } from "@sapphire/framework";
import type { User } from "discord.js";
import React, { useState } from "react";

type HandbookPage = {
  pageName: string;
  content: string;
};

export default function HandbookComponent(props: {
  user: User;
  basePage: string;
}) {
  const { user, basePage } = props;

  const [page, setPage] = useState<HandbookPage>({
    pageName: "Welcome",
    content: basePage,
  });

  return (
    <>
      <Embed color={EvieColors.evieGrey} description={page.content} />
      <Select
        user={user}
        value={page.pageName}
        onChangeValue={(value) => {
          const newPage = container.client.handbook.pages.get(value);
          if (!newPage) throw "Handbook unavailable!";
          setPage({
            pageName: value,
            content: newPage,
          });
        }}
      >
        {container.client.handbook.pages.map((_, pageName) => (
          <Option label={pageName} key={pageName} value={pageName} />
        ))}
      </Select>
    </>
  );
}
