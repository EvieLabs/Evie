import { Embed } from "#reacord/main";
import { HenrikAPIRoot } from "#root/constants/index";
import { getCompTierEmoji } from "#root/lib/valorant/emojis";
import type {
  AccountData,
  GetHenrikAPI,
  MMRDataV1,
} from "#types/api/HenrikValorant";
import axios from "axios";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function ValorantCompStats(props: {
  user: User;
  accountData: AccountData;
}) {
  const { accountData } = props;

  const [compStats, setCompStats] = useState<GetHenrikAPI<MMRDataV1> | null>();

  useEffect(() => {
    axios
      .get<GetHenrikAPI<MMRDataV1>>(
        `${HenrikAPIRoot}/valorant/v1/mmr/ap/tristan/${accountData.tag}`
      )
      .then((res) => {
        setCompStats(res.data);
      })
      .catch(() => {
        setCompStats({
          status: 404,
        });
      });
  }, []);

  const a = "➤";
  const l = "\n";

  return (
    <>
      <Embed title={`${accountData.name}#${accountData.tag} Competitive Stats`}>
        {compStats?.status === 404 ? (
          <>{a} **No competitive stats found**</>
        ) : (
          <>
            {compStats?.data ? (
              <>
                {a} **Rank**:{" "}
                {getCompTierEmoji(compStats.data.currenttierpatched)}{" "}
                {compStats.data.currenttierpatched} {l}
                {a} **Elo**: {compStats.data.elo} {l}
                {a} **MMR Change since last game**:{" "}
                {compStats.data.mmr_change_to_last_game}
              </>
            ) : (
              "Loading..."
            )}
          </>
        )}
      </Embed>
    </>
  );
}
