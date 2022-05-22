export enum EvieColors {
  eviePink = 0xf47fff,
  evieGrey = 0x2f3136,
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
