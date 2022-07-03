import type {
  AirportSettings,
  EviePlus,
  GuildSettings,
  ModerationSettings,
  UserFlags,
} from "@prisma/client";

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
