export enum EvieColors {
  eviePink = 0xf47fff,
  evieGrey = 0x2f3136,
}

export enum Emojis {
  evieWristSlap = "<:evieWS:969902527325831208>",
  valorantLogo = "<:valorant:971373514152095755>",
  valorantRadiant = "<:radiant:971675273911218196>",
  valorantFade = "<:fade:973184566321893417>",
  slashCommand = "<:slash:982630315493318716>",
  contextMenu = "<:contextMenu:982631122074755124>",
  topgg = "<:topgg:982864774012485683>",
}

export enum EvieEvent {
  Vote = "vote",
}

export enum ModActionType {
  Kick = 0,
  Softban = 1,
  Ban = 2,
  Unban = 3,
  Timeout = 4,
  UnTimeout = 5,
}

export const OppositeModActionType = (type: ModActionType) => {
  switch (type) {
    case ModActionType.Unban:
      return ModActionType.Ban;
    case ModActionType.UnTimeout:
      return ModActionType.Timeout;
  }
  return null;
};
