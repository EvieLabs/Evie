import type { EvieEvent } from "#root/Enums";
import { getSecret } from "#root/utils/parsers/envUtils";
import { PrismaClient } from ".prisma/client";
import { EvieClientOptions } from "@evie/config";
import { Kennel } from "@evie/home";
import { ReacordDiscordJs } from "@evie/reacord";
import type { VotePayload } from "@evie/shapers";
import { Enumerable } from "@sapphire/decorators";
import { SapphireClient } from "@sapphire/framework";
import { Airport } from "./Airport";
import { BlockedWords } from "./BlockedWords";
import { DatabaseTools } from "./DatabaseTools";
import { EvieGuildLogger } from "./EvieGuildLogger";
import { EviePunish } from "./EviePunish";
import { Phisherman } from "./Phisherman";
import { Stats } from "./Stats";

export class EvieClient extends SapphireClient {
  /** The phisherman instance used for checking domains */
  @Enumerable(false)
  public override phisherman = new Phisherman();

  /** The blocked words instance used for checking messages for blocked words */
  @Enumerable(false)
  public override blockedWords = new BlockedWords();

  /** The EviePunish instance used for punishing people */
  @Enumerable(false)
  public override punishments = new EviePunish();

  /** The Airport instance used for handling guild join and leave events */
  @Enumerable(false)
  public override airport = new Airport();

  /** The EvieGuildLogger instance used for logging events in a specified channel in a guild */
  @Enumerable(false)
  public override guildLogger = new EvieGuildLogger();

  /** The prisma instance used for directly interacting with the database */
  @Enumerable(false)
  public override prisma = new PrismaClient();

  /** The database tools instance used for easily interacting with the database */
  @Enumerable(false)
  public override db = new DatabaseTools();

  /** The stats instance used for grabbing statistics of the current bot */
  @Enumerable(false)
  public override stats = new Stats();

  @Enumerable(false)
  public override reacord: ReacordDiscordJs = new ReacordDiscordJs(this);

  @Enumerable(false)
  public override startedAt = new Date();

  @Enumerable(false)
  public override kennel = new Kennel(getSecret("KENNEL_ID"));

  public constructor() {
    super(EvieClientOptions);
  }
}

declare module "discord.js" {
  interface Client {
    readonly phisherman: Phisherman;
    readonly punishments: EviePunish;
    readonly guildLogger: EvieGuildLogger;
    readonly blockedWords: BlockedWords;
    readonly airport: Airport;
    readonly prisma: PrismaClient;
    readonly db: DatabaseTools;
    readonly stats: Stats;
    readonly reacord: ReacordDiscordJs;
    readonly startedAt: Date;
    readonly kennel: Kennel;
    emit(event: EvieEvent.Vote, data: VotePayload): boolean;
  }
}
