import { transformOauthGuildsAndUser } from "#utils/api/transformers";
import { getNumberSecret, getSecret } from "#utils/parsers/envUtils";
import { PrismaClient } from ".prisma/client";
import { ReacordDiscordJs } from "@evie/reacord";
import { Enumerable } from "@sapphire/decorators";
import { container, LogLevel, SapphireClient } from "@sapphire/framework";
import type { InternationalizationContext } from "@sapphire/plugin-i18next/dist/lib/types";
import { Intents, Options } from "discord.js";
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
      i18n: {
        fetchLanguage: async (context: InternationalizationContext) => {
          if (!context.interactionLocale) return "en-US";
          if (context.interactionLocale === "en") return "en-US"; // Removes the chance of picking en-AU instead of en-US

          let langCode = "en-US";

          container.i18n.languages.forEach((_, languageFolderName) => {
            if (languageFolderName.startsWith(`${context.interactionLocale}`)) {
              langCode = languageFolderName;
            }
          });

          return langCode;
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
        level:
          getSecret("NODE_ENV", false) === "production"
            ? LogLevel.Info
            : LogLevel.Debug,
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
    readonly stats: Stats;
    readonly reacord: ReacordDiscordJs;
    readonly startedAt: Date;
  }
}
