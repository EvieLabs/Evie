import type { PlayerCard } from "./types";

export interface MatchHistoryDataV3 {
	metadata: MatchMetadata;
	players: MatchPlayers;
	teams: Teams;
	rounds: Round[];
	kills: Kill[];
}

export interface Round {
	winning_team: string;
	end_type: EndType;
	bomb_planted: boolean;
	bomb_defused: boolean;
	plant_events: PlantEvents;
	defuse_events: DefuseEvents;
	player_stats: PlayerStat[];
}

export interface DefuseEvents {
	defuse_location: Location | null;
	defused_by: EdBy | null;
	defuse_time_in_round: number | null;
	player_locations_on_defuse: PlayerLocationsOn[] | null;
}

export interface PlantEvents {
	plant_location: Location | null;
	planted_by: EdBy | null;
	plant_site: PlantSite | null;
	plant_time_in_round: number | null;
	player_locations_on_plant: PlayerLocationsOn[] | null;
}

export enum PlantSite {
	A = "A",
	B = "B",
	C = "C",
}

export interface PlayerLocationsOn {
	player_puuid: string;
	player_display_name: string;
	player_team: Team;
	location: Location;
	view_radians: number;
}

export interface Location {
	x: number;
	y: number;
}

export interface EdBy {
	puuid: string;
	display_name: string;
	team: Team;
}

export enum EndType {
	BombDefused = "Bomb defused",
	BombDetonated = "Bomb detonated",
	Eliminated = "Eliminated",
	RoundTimerExpired = "Round timer expired",
}

export interface Teams {
	red: TeamsBlue;
	blue: TeamsBlue;
}

export interface TeamsBlue {
	has_won: boolean | null;
	rounds_won: number | null;
	rounds_lost: number | null;
}

export interface TeamsRed {
	has_won: boolean | null;
	rounds_won: number | null;
	rounds_lost: number | null;
}

export interface MatchMetadata {
	map: string;
	game_version: string;
	game_length: number;
	game_start: number;
	game_start_patched: string;
	rounds_played: number;
	mode: string;
	season_id: string;
	platform: string;
	matchid: string;
	region: string;
	cluster: string;
}

export interface MatchPlayers {
	all_players: AllPlayer[];
	red: BlueElement[];
	blue: BlueElement[];
}

export interface AllPlayer {
	puuid: string;
	name: string;
	tag: string;
	team: string;
	level: number;
	character: string;
	currenttier: number;
	currenttier_patched: string;
	player_card: string;
	player_title: string;
	party_id: string;
	session_playtime: SessionPlaytime;
	behavior: Behavior;
	platform: PlatformClass;
	ability_casts: AbilityCasts;
	assets: PlayerAssets;
	stats: PlayerMatchStats;
	economy: PlayerEconomy;
	damage_made?: number;
	damage_received?: number;
}

export interface AbilityCasts {
	c_cast: number | null;
	q_cast: number | null;
	e_cast: number | null;
	x_cast: number | null;
}

export interface BlueElement {
	puuid: string;
	name: string;
	tag: string;
	team: Team;
	level: number;
	character: string;
	currenttier: number;
	currenttier_patched: string;
	player_card: string;
	player_title: string;
	party_id: string;
	session_playtime: SessionPlaytime;
	behavior: Behavior;
	platform: PlatformClass;
	ability_casts: AbilityCasts;
	assets: PlayerAssets;
	stats: PlayerMatchStats;
	economy: PlayerEconomy;
	damage_made: number;
	damage_received: number;
}

export interface PlayerEconomy {
	spent: LoadoutValue;
	loadout_value: LoadoutValue;
}

export interface LoadoutValue {
	overall: number;
	average: number;
}

export interface PlayerMatchStats {
	score: number;
	kills: number;
	deaths: number;
	assists: number;
	bodyshots: number | null;
	headshots: number | null;
	legshots: number | null;
}

export interface PlayerStat {
	player_puuid: string;
	player_display_name: string;
	player_team: string;
	damage_events: DamageEvent[];
	damage: number;
	bodyshots: number;
	headshots: number;
	legshots: number;
	kill_events: Kill[];
	kills: number;
	score: number;
	economy: PlayerStatEconomy;
	was_afk: boolean;
	was_penalized: boolean;
	stayed_in_spawn: boolean;
}

export interface PlayerStatEconomy {
	loadout_value: number;
	weapon: Weapon;
	armor: Armor;
	remaining: number;
	spent: number;
}

export interface Armor {
	id: string | null;
	name: string | null;
	assets: ArmorAssets;
}

export interface ArmorAssets {
	display_icon: null | string;
}

export interface Weapon {
	id: string | null;
	name: string | null;
	assets: DamageWeaponAssetsClass;
}

export interface Kill {
	kill_time_in_round: number;
	kill_time_in_match: number;
	round?: number;
	killer_puuid: string;
	killer_display_name: string;
	killer_team: string;
	victim_puuid: string;
	victim_display_name: string;
	victim_team: string;
	victim_death_location: Location;
	damage_weapon_id: string;
	damage_weapon_name?: string | null;
	damage_weapon_assets: DamageWeaponAssetsClass;
	secondary_fire_mode: boolean;
	player_locations_on_kill: PlayerLocationsOn[];
	assistants: Assistant[];
}

export interface Assistant {
	assistant_puuid: string;
	assistant_display_name: string;
	assistant_team: string;
}

export interface DamageWeaponAssetsClass {
	display_icon?: null | string;
	killfeed_icon?: null | string;
}
export interface DamageEvent {
	receiver_puuid: string;
	receiver_display_name: string;
	receiver_team: Team;
	bodyshots: number;
	damage: number;
	headshots: number;
	legshots: number;
}

export interface PlayerAssets {
	card: Omit<PlayerCard, "id">;
	agent: Agent;
}

export interface Agent {
	small: string;
	bust: string;
	full: string;
	killfeed: string;
}

export interface SessionPlaytime {
	minutes?: number;
	seconds: number | null;
	milliseconds: number | null;
}

export interface Behavior {
	afk_rounds: number | number;
	friendly_fire: FriendlyFire;
	rounds_in_spawn: number | null;
}

export interface FriendlyFire {
	incoming: number | null;
	outgoing: number | null;
}

export interface PlatformClass {
	type: string;
	os: OS;
}

export interface OS {
	name: string;
	version: string;
}

export enum Team {
	Blue = "Blue",
	Red = "Red",
}
