import { EvieColors } from "#root/Enums";
import type { ResponseWrapper } from "#root/types/api/APIResponses";
import { pluralize } from "#root/utils/builders/stringBuilder";
import { Embed } from "@evie/reacord";
import { AccountData, fetchMatchHistory, ShapedMatchHistory } from "@evie/valorant";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function ValorantGameStats(props: { user: User; accountData: AccountData }) {
	const [gameStats, setGameStats] = useState<ResponseWrapper<ShapedMatchHistory> | null>();

	useEffect(() => {
		fetchMatchHistory({
			region: props.accountData.region,
			name: props.accountData.name,
			tag: props.accountData.tag,
			puuid: props.accountData.puuid,
		})
			.then((res) => {
				return setGameStats({
					success: true,
					data: res,
				});
			})
			.catch(() => {
				setGameStats({
					success: false,
				});
			});
	}, []);

	const a = "➤";
	const l = "\n";
	const { data, success } = gameStats || {};
	const { overview, trackedGames } = data || {};

	return (
		<>
			<Embed
				color={EvieColors.evieGrey}
				title={`${props.accountData.name}#${props.accountData.tag} Game Stats`}
				footer={{
					text:
						success && data && overview && trackedGames
							? `Tracked from ${trackedGames} ${pluralize("game", trackedGames)}`
							: "Loading...",
				}}
			>
				{!gameStats ? (
					<>
						<>{a} **Loading...**</>
					</>
				) : success && data && overview ? (
					<>
						{a} **KD**: {overview.kdr}% {l}
						{a} **Win Ratio**: {overview.winRatio}% ({overview.wins}-{overview.losses}) {l}
						{a} **Most Played Agent** {overview.agentsUsed[0].agentName} {l}
					</>
				) : (
					<>
						{a} **Error**: {gameStats.success ? "No data found for this account." : "An error occurred."}
					</>
				)}
			</Embed>
		</>
	);
}
