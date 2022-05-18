import { Embed } from "#reacord/main";
import { colors } from "#root/constants/config";
import type { AccountData } from "#root/types/api/Henrik/HenrikValorant";
import type { User } from "discord.js";
import React from "react";

export default function ValorantUserInfo(props: {
  user: User;
  accountData: AccountData;
}) {
  const { accountData: data } = props;
  const a = "➤";
  const l = "\n";

  return (
    <>
      <Embed
        color={colors.evieGrey}
        title={data ? `${data.name}#${data.tag}` : "Loading..."}
        image={{ url: data?.card.wide ?? "" }}
      >
        {data ? (
          <>
            {a} **Region**: {data.region} {l}
            {a} **Level**: {data.account_level} {l}
            {a} **Last-Updated Data**: {data.last_update} {l}
          </>
        ) : (
          "Loading..."
        )}
      </Embed>
    </>
  );
}
