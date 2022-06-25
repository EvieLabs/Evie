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
  discordListSpace = "<:discordlistspace:982903545068150794>",
  discordBotList = "<:dbl:982959680693354516>",
  evie = "<:Evie:940139203222716426>",
  enabled = "<:enabled:986868008750305311>",
  disabled = "<:disabled:986868010507698216>",
  bulletPoint = "<:bulletPoint:987974786401579038>",
  unknownBadge = "<:unknownBadge:990103624829009980>",
  evieContributor = "<:evieContributor:990103797143588927>",
  evieCreator = "<:evieCreator:990113153658540072>",
  verified = "<:verifiedBotMark:893287253898588180>",
  certifiedModerator = "<:certifiedModerator:990120551660007474>",
  discordStaff = "<:discordStaff:990120781998608454>",
  partner = "<:partner:990121125705031682>",
  houseBalance = "<:houseBalance:990121358275010580>",
  houseBravery = "<:houseBravery:990121496359878666>",
  houseBrilliance = "<:houseBrilliance:990121600756101150>",
  earlyVerifiedBotDeveloper = "<:earlyVerifiedBotDeveloper:990121766531772497>",
  earlySupporter = "<:earlySupporter:990121881464086568>",
  bugHunterLevel1 = "<:bugHunterLevel1:990122012859052032>",
  bugHunterLevel2 = "<:bugHunterLevel2:990122136767172618>",
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

export enum PrismaAction {
  findUnique = "findUnique",
  findMany = "findMany",
  findFirst = "findFirst",
  create = "create",
  createMany = "createMany",
  update = "update",
  updateMany = "updateMany",
  upsert = "upsert",
  delete = "delete",
  deleteMany = "deleteMany",
  executeRaw = "executeRaw",
  queryRaw = "queryRaw",
  aggregate = "aggregate",
  count = "count",
  runCommandRaw = "runCommandRaw",
}
