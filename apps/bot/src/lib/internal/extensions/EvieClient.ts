/* eslint-disable @typescript-eslint/method-signature-style */
import type { EvieEvent } from "#root/Enums";
import { EvieClientOptions } from "@evie/config";
import { Kennel } from "@evie/home";
import { PubSubClient, PubSubClientEvents } from "@evie/pubsub";
import { ReacordDiscordJs } from "@evie/reacord";
import { SentryClient } from "@evie/sentry";
import type { VotePayload } from "@evie/shapers";
import { PrismaClient } from "@prisma/client";
import { Enumerable } from "@sapphire/decorators";
import { container, SapphireClient, StoreRegistry } from "@sapphire/framework";
import { Environment } from "@teamevie/env";
import axios, { AxiosInstance } from "axios";
import { SnowflakeUtil } from "discord.js";
import { Stats } from "../structures/managers/Stats";
import { DatabaseTools } from "../structures/tools/DatabaseTools";
import { EvieGuildLogger } from "../structures/tools/EvieGuildLogger";
import { EviePunish } from "../structures/tools/EviePunish";
import { Gate } from "../structures/tools/Gate";
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
	public override kennel = new Kennel(Environment.getString("KENNEL_ID"));

	@Enumerable(false)
	public override gate = new Gate();

	@Enumerable(false)
	public override evieRest = axios.create({
		baseURL: Environment.getString("API_URL"),
	});

	@Enumerable(false)
	public override sentry?: SentryClient;

	@Enumerable(false)
	public override session = SnowflakeUtil.generate();

	@Enumerable(false)
	public override pubsub: PubSubClient = new PubSubClient({
		intents: [PubSubClientEvents.TailWebhook, PubSubClientEvents.TagQuery],
	});

	public constructor() {
		super(EvieClientOptions);
		container.logger.info("Starting Evie...");

		container.logger.debug("Connecting to database...");
		this.prisma.$connect().then(() => container.logger.debug("Connected to database!"));

		this.initSentryClient();
	}

	private initSentryClient() {
		const sentryToken = Environment.getString("SENTRY_TOKEN", true);
		const sentryOrg = Environment.getString("SENTRY_ORG", true);
		const sentryProject = Environment.getString("SENTRY_PROJECT", true);

		if (sentryToken && sentryOrg && sentryProject) {
			container.logger.debug("Initializing Sentry client...");

			this.sentry = new SentryClient({
				organizationSlug: sentryOrg,
				token: sentryToken,
			});
		}
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
		readonly evieRest: AxiosInstance;
		readonly modules: StoreRegistry;
		readonly gate: Gate;
		readonly sentry?: SentryClient;
		readonly session: string;
		readonly pubsub: PubSubClient;
		emit(event: EvieEvent.Vote, data: VotePayload): boolean;
	}
}
