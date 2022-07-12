import type { AgentUsed } from "./types";
import { MatchHistoryDataV3, Team } from "../types/types";

export default class ShapedMatchHistory {
	public constructor(private readonly raw: MatchHistoryDataV3[], private readonly puuid: string) {}
	public round = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;

	public get trackedGames(): number {
		return this.raw.length;
	}

	public overview = {
		kills: this.kills,
		deaths: this.deaths,
		kdr: this.round(this.killDeathRatio),
		wins: this.gamesWon,
		losses: this.gamesLost,
		winRatio: this.round(this.winLossRatio),
		agentsUsed: this.agentsUsed.sort((a, b) => b.timesUsed - a.timesUsed),
	};

	private get agentsUsed(): AgentUsed[] {
		const agents: AgentUsed[] = [];
		this.raw.map((match) => {
			const player = match.players.all_players.find((player) => player.puuid === this.puuid);
			if (!player) return;
			const agent = agents.find((a) => a.agentName === player.character);
			if (agent) {
				agent.timesUsed++;
			} else {
				agents.push({
					agentName: player.character,
					timesUsed: 1,
				});
			}
		});
		return agents;
	}

	private get killDeathRatio(): number {
		if (this.kills === 0) {
			return 0;
		}
		if (this.deaths === 0) {
			return 1;
		}
		return this.kills / this.deaths;
	}

	private get winLossRatio(): number {
		if (this.gamesWon === 0) {
			return 0;
		}
		if (this.gamesLost === 0) {
			return 1;
		}
		return this.gamesWon / this.gamesLost;
	}

	private get gamesWon(): number {
		let wins = 0;

		this.raw.map((match) => {
			const player = match.players.all_players.find((player) => player.puuid === this.puuid);

			switch (player?.team) {
				case Team.Red: {
					if (match.teams.red.has_won) {
						wins++;
					}
					break;
				}
				case Team.Blue: {
					if (match.teams.blue.has_won) {
						wins++;
					}
					break;
				}
				default: {
					break;
				}
			}
		});
		return wins;
	}

	private get gamesLost(): number {
		let losses = 0;

		this.raw.map((match) => {
			const player = match.players.all_players.find((player) => player.puuid === this.puuid);

			switch (player?.team) {
				case Team.Red: {
					if (!match.teams.red.has_won) {
						losses++;
					}
					break;
				}
				case Team.Blue: {
					if (!match.teams.blue.has_won) {
						losses++;
					}
					break;
				}
				default: {
					break;
				}
			}
		});
		return losses;
	}

	private get kills(): number {
		return this.raw
			.map((match) => match.players.all_players)
			.reduce((acc, curr) => {
				const player = curr.find((p) => p.puuid === this.puuid);
				if (player) {
					return acc + player.stats.kills;
				}
				return acc;
			}, 0);
	}

	public get deaths(): number {
		return this.raw
			.map((match) => match.players.all_players)
			.reduce((acc, curr) => {
				const player = curr.find((p) => p.puuid === this.puuid);
				if (player) {
					return acc + player.stats.deaths;
				}
				return acc;
			}, 0);
	}
}
