import { EvieColors } from "#root/Enums";
import type { ResponseWrapper } from "#root/types/api/APIResponses";
import { Embed } from "@evie/reacord";
import { AccountData, fetchCompStats, ShapedCompStats } from "@evie/valorant";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function ValorantCompStats(props: {
  user: User;
  accountData: AccountData;
}) {
  const [compStats, setCompStats] =
    useState<ResponseWrapper<ShapedCompStats> | null>();

  useEffect(() => {
    fetchCompStats({
      region: props.accountData.region,
      name: props.accountData.name,
      tag: props.accountData.tag,
    })
      .then((res) => {
        return setCompStats({
          success: true,
          data: res,
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
        color={EvieColors.evieGrey}
        title={`${props.accountData.name}#${props.accountData.tag} Competitive Stats`}
      >
        {!compStats ? (
          <>
            <>{a} **Loading...**</>
          </>
        ) : compStats.success && compStats.data ? (
          <>
            {a} **Rank**: {compStats.data.currentRating.rank.discordEmoji}{" "}
            {compStats.data.currentRating.rank.name} {l}
            {a} **Peak Rank**: {compStats.data.peakSeason.rank.discordEmoji}{" "}
            {compStats.data.peakSeason.rank.name} {l}
            {a} **Rank Rating**: {compStats.data.currentRating.rank.elo} (
            {compStats.data.currentRating.rrChangeToLastGame}) {l}
          </>
        ) : (
          <>
            {a} **Error**:{" "}
            {compStats.success
              ? "No data found for this account."
              : "An error occurred."}
          </>
        )}
      </Embed>
    </>
  );
}
