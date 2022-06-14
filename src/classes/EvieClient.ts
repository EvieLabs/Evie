import type { EvieEvent } from "#root/Enums";
import { getSecret } from "#root/utils/parsers/envUtils";
import { PrismaClient } from ".prisma/client";
import { EvieClientOptions } from "@evie/config";
import { Kennel } from "@evie/home";
import { ReacordDiscordJs } from "@evie/reacord";
import type { VotePayload } from "@evie/shapers";
import { Enumerable } from "@sapphire/decorators";
import { SapphireClient } from "@sapphire/framework";
import { Collection } from "discord.js";
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

  public override dbCache = new Collection<string, unknown>();

  public constructor() {
    super(EvieClientOptions);

    // this.prisma.$use(async (params, next) => {
    //   if (!params.model) return await next(params);
    //   const keyCacheKey = `${params.model}:${JSON.stringify(params.args)}`;

    //   if (
    //     params.action === PrismaAction.update ||
    //     params.action === PrismaAction.delete ||
    //     params.action === PrismaAction.create ||
    //     params.action === PrismaAction.upsert ||
    //     params.action === PrismaAction.updateMany ||
    //     params.action === PrismaAction.deleteMany ||
    //     params.action === PrismaAction.createMany
    //   ) {
    //     const outdatedKeys = this.dbCache.filter((_, key) =>
    //       key.startsWith(`${params.model}`)
    //     );

    //     outdatedKeys.forEach((_, key) => this.dbCache.delete(key));
    //   }

    //   if (this.dbCache.has(keyCacheKey)) {
    //     return this.dbCache.get(keyCacheKey);
    //   }
    //   const result = await next(params);
    //   this.dbCache.set(keyCacheKey, result);
    //   return result;
    // });
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
    readonly dbCache: Collection<string, unknown>;
    emit(event: EvieEvent.Vote, data: VotePayload): boolean;
  }
}
