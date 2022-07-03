export interface GetHenrikAPI<T> {
  status: number;
  data?: T;
}

export interface AccountData {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: PlayerCard;
  last_update: string;
}

export interface PlayerCard {
  small: string;
  large: string;
  wide: string;
  id: string;
}

export interface MMRDataV2 {
  name: string;
  tag: string;
  puuid: string;
  current_data: CurrentData;
  by_season: BySeason;
}

export interface BySeason {
  [season: string]: Season;
}

export interface Season {
  wins: number;
  number_of_games: number;
  final_rank: number;
  final_rank_patched: string;
  act_rank_wins: ActRankWin[];
}

export interface ActRankWin {
  patched_tier: string;
  tier: number;
}

export interface CurrentData {
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
  games_needed_for_rating: number;
}

export * from "./MatchStats";
