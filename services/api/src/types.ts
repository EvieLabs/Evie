import type {
  AirportSettings,
  EviePlus,
  GuildSettings,
  ModerationSettings,
  UserFlags,
} from "@prisma/client";

export type VoteAPIReq = {
  bot: string;
  user: string;
  type: "upvote" | "test";
  isWeekend: boolean;
  query: string;
};

export type ProcessedStats = {
  servers: number;
  users: number;
  shards: number;
  shardAvgPing: number;
};

export type GetMe = {
  id: string;
  name: string;
  guilds: EvieGuild[];
  eviePlus: EviePlus[];
  flags: UserFlags[];
};

export type EvieGuild = TransformedGuild &
  GuildSettings &
  AirportSettings &
  ModerationSettings;

export type TransformedGuild = {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  eviePlus?: string;
};
