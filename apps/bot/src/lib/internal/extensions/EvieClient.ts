/* eslint-disable @typescript-eslint/method-signature-style */
import type { EvieEvent } from "#root/Enums";
import { EvieClientOptions, getSecret } from "@evie/config";
import { CoolifyConfig, ParseJwt } from "@evie/coolify-client";
import { Kennel } from "@evie/home";
import { ReacordDiscordJs } from "@evie/reacord";
import { SentryClient } from "@evie/sentry";
import { VotePayload } from "@evie/shapers";
import { PrismaClient } from "@prisma/client";
import { Enumerable } from "@sapphire/decorators";
import { SapphireClient, StoreRegistry } from "@sapphire/framework";
import axios, { AxiosInstance } from "axios";
import { SnowflakeUtil } from "discord.js";
import { Docker } from "node-docker-api";
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
	public override kennel = new Kennel(getSecret("KENNEL_ID"));

	@Enumerable(false)
	public override gate = new Gate();

	@Enumerable(false)
	public override evieRest = axios.create({
		baseURL: getSecret("API_URL", false),
	});

	@Enumerable(false)
	public override votePayload = VotePayload;

	@Enumerable(false)
	public override sentry?: SentryClient;

	@Enumerable(false)
	public override session = SnowflakeUtil.generate();

	@Enumerable(false)
	public override coolify?: CoolifyConfig;

	public constructor() {
		super(EvieClientOptions);

		this.initSentryClient();
		this.initCoolifyConfig();
	}

	private initSentryClient() {
		const sentryToken = getSecret("SENTRY_TOKEN", false);
		const sentryOrg = getSecret("SENTRY_ORG", false);
		const sentryProject = getSecret("SENTRY_PROJECT", false);

		if (sentryToken !== "" && sentryOrg !== "" && sentryProject !== "") {
			this.sentry = new SentryClient({
				organizationSlug: sentryOrg,
				token: sentryToken,
			});
		}
	}

	private async initCoolifyConfig() {
		const containerName = getSecret("CONTAINER_NAME", false);
		if (containerName === "") return;

		const docker = new Docker({ socketPath: "/var/run/docker.sock" });
		const container = docker.container.get(containerName);

		if ("Labels" in container.data) {
			const labels = container.data.Labels as Record<string, string>;
			if ("coolify.config" in labels) {
				const config = await ParseJwt(labels["coolify.config"] as string);
				this.coolify = config;
			}
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
		readonly votePayload: typeof VotePayload;
		readonly sentry?: SentryClient;
		readonly session: string;
		readonly coolify?: CoolifyConfig;
		emit(event: EvieEvent.Vote, data: VotePayload): boolean;
	}
}
