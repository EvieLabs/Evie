import { transformOauthGuildsAndUser } from "#root/utils/api/transformers";
import { getNumberSecret, getSecret } from "#root/utils/parsers/envUtils";
import { PrismaClient } from ".prisma/client";
import { Enumerable } from "@sapphire/decorators";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Intents, Options } from "discord.js";
import { Airport } from "./Airport";
import { BlockedWords } from "./BlockedWords";
import { DatabaseTools } from "./DatabaseTools";
import { EvieGuildLogger } from "./EvieGuildLogger";
import { EviePunish } from "./EviePunish";
import { Phisherman } from "./Phisherman";

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

  public constructor() {
    super({
      api: {
        auth: {
          id: getSecret("DISCORD_CLIENT_ID"),
          secret: getSecret("DISCORD_SECRET"),
          cookie: getSecret("COOKIE_NAME"),
          redirect: getSecret("REDIRECT_URL"),
          scopes: ["identify", "guilds"],
          transformers: [transformOauthGuildsAndUser],
        },
        origin: getSecret("ORIGIN_URL"),
        listenOptions: {
          port: getNumberSecret("API_PORT") || 4000,
        },
      },
      makeCache: Options.cacheEverything(),
      sweepers: {
        ...Options.defaultSweeperSettings,
        messages: {
          interval: 190,
          lifetime: 900,
        },
      },
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      logger: {
        level: LogLevel.Info,
      },
      loadMessageCommandListeners: true,
      shards: "auto",
      allowedMentions: { users: [], roles: [] },
    });
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
  }
}
