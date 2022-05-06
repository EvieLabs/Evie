import { Embed } from "#reacord/main";
import { HenrikAPIRoot } from "#root/constants/index";
import { getCompTierEmoji } from "#root/lib/valorant/emojis";
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
  const { accountData } = props;

  const [compStats, setCompStats] = useState<GetHenrikAPI<MMRDataV2> | null>();

  useEffect(() => {
    axios
      .get<GetHenrikAPI<MMRDataV2>>(
        `${HenrikAPIRoot}/valorant/v2/mmr/ap/${accountData.name}/${accountData.tag}`
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
                {getCompTierEmoji(
                  compStats.data.current_data.currenttierpatched
                )}{" "}
                {compStats.data.current_data.currenttierpatched} {l}
                {a} **Elo**: {compStats.data.current_data.elo} {l}
                {a} **MMR Change since last game**:{" "}
                {compStats.data.current_data.mmr_change_to_last_game}
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
