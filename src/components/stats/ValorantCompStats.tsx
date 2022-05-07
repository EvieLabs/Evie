import { Embed } from "#reacord/main";
import { HenrikAPIRoot } from "#root/constants/index";
import type { ResponseWrapper } from "#root/types/api/APIResponses";
import ShapedCompStats from "#root/utils/valorant/ShapedCompStats";
import type {
  AccountData,
  GetHenrikAPI,
  MMRDataV2,
} from "#types/api/HenrikValorant";
import axios from "axios";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function ValorantCompStats(props: {
  user: User;
  accountData: AccountData;
}) {
  const [compStats, setCompStats] =
    useState<ResponseWrapper<ShapedCompStats> | null>();

  useEffect(() => {
    axios
      .get<GetHenrikAPI<MMRDataV2>>(
        `${HenrikAPIRoot}/valorant/v2/mmr/ap/${props.accountData.name}/${props.accountData.tag}`
      )
      .then((res) => {
        if (!res.data.data)
          return setCompStats({
            success: false,
          });
        return setCompStats({
          success: true,
          data: new ShapedCompStats(res.data.data),
        });
      })
      .catch(() => {
        setCompStats({
          success: false,
        });
      });
  }, []);

  const a = "➤";
  const l = "\n";

  return (
    <>
      <Embed
        title={`${props.accountData.name}#${props.accountData.tag} Competitive Stats`}
      >
        {!compStats?.success ? (
          <>{a} **No competitive stats found**</>
        ) : (
          <>
            {compStats?.data ? (
              <>
                {a} **Rank**: {compStats.data.currentRating.rank.discordEmoji}{" "}
                {compStats.data.currentRating.rank.name} {l}
                {a} **Elo**: {compStats.data.currentRating.elo} {l}
                {a} **MMR Change since last game**:{" "}
                {compStats.data.currentRating.mmrChangeToLastGame} {l}
                {a} **Peak Rank**: {compStats.data.peakSeason.rank.discordEmoji}{" "}
                {compStats.data.peakSeason.rank.name} {l}
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
