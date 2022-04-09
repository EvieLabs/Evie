export interface McMMORes {
  repair: number;
  fishing: number;
  axes: number;
  swords: number;
  powerLevel: number;
  alchemy: number;
  Herbalism: number;
  mining: number;
  error: boolean;
  acrobatics: number;
  woodcutting: number;
  excavation: number;
  unarmed: number;
  archery: number;
  taming: number;
}

export interface DiscordLookupRes {
  discordId: string;
  error: boolean;
  discordTag: string;
  discordName: string;
}
