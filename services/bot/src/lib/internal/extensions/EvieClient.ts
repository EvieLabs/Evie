import type { EvieEvent } from "#root/Enums";
import { PrismaClient } from ".prisma/client";
import { EvieClientOptions, getSecret } from "@evie/config";
import { Kennel } from "@evie/home";
import { ModuleStore } from "@evie/internal";
import { ReacordDiscordJs } from "@evie/reacord";
import type { VotePayload } from "@evie/shapers";
import { Enumerable } from "@sapphire/decorators";
import { SapphireClient, StoreRegistry } from "@sapphire/framework";
import axios, { AxiosInstance } from "axios";
import Handbook from "../structures/managers/Handbook";
import { Stats } from "../structures/managers/Stats";
import { DatabaseTools } from "../structures/tools/DatabaseTools";
import { EvieGuildLogger } from "../structures/tools/EvieGuildLogger";
import { EviePunish } from "../structures/tools/EviePunish";

export class EvieClient extends SapphireClient {
  /** The EviePunish instance used for punishing people */
  @Enumerable(false)
  public override punishments = new EviePunish();

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

  @Enumerable(false)
  public override handbook = new Handbook();

  @Enumerable(false)
  public override evieRest = axios.create({
    baseURL: getSecret("PARK_URL", false),
  });

  @Enumerable(false)
  public override modules = this.stores.register(new ModuleStore());

  public constructor() {
    super(EvieClientOptions);
    this.stores.registerPath("modules");

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
    readonly punishments: EviePunish;
    readonly guildLogger: EvieGuildLogger;
    readonly prisma: PrismaClient;
    readonly db: DatabaseTools;
    readonly stats: Stats;
    readonly reacord: ReacordDiscordJs;
    readonly startedAt: Date;
    readonly kennel: Kennel;
    readonly handbook: Handbook;
    readonly evieRest: AxiosInstance;
    readonly modules: StoreRegistry;
    emit(event: EvieEvent.Vote, data: VotePayload): boolean;
  }
}
