/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ModuleSchema } from "#root/Constants";
import { container, Events } from "@sapphire/framework";
import type { Snowflake } from "discord.js";
import { toString } from "lodash";

export class ModuleConfigStore {
	public constructor(public readonly options: ModuleConfigStore.Options) {
		this.init();
	}

	private readonly cache = new Map<string, unknown>();

	public get<T>(guildId: Snowflake, key: string): T | undefined {
		return this.cache.get(`${guildId}-${key}`) as T | undefined;
	}

	private init() {
		container.client.isReady()
			? void this.loadGuilds(container.client.guilds.cache.map((g) => g.id))
			: container.client.once(Events.ClientReady, (c) => {
					container.logger.debug("[ConfigStore] Initializing...");
					void this.loadGuilds(c.guilds.cache.map((g) => g.id));
			  });

		container.client.on(Events.GuildCreate, (guild) => {
			console.log(`[ConfigStore] Guild ${guild.name} (${guild.id}) created.`);
			void this.loadGuilds([guild.id]);
		});
	}

	private async loadGuilds(guildIds: Snowflake[]) {
		for (const guildId of guildIds) {
			const { prisma } = container.client;
			const { logger } = container;

			const guildSettings = await prisma.guildSettings.findFirst({
				where: {
					id: guildId,
				},
			});

			if (!guildSettings) {
				logger.warn(
					`[ConfigStore] Guild ${guildId} not found in database! (most likely first time using Evie, safely ignore if it is!) Skipping...`,
				);
				continue;
			}

			const modules = guildSettings.modules.map((module) => ModuleSchema.parse(module));

			for (const module of modules) {
				if (module.name === this.options.moduleName) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					for (const [key, value] of Object.entries(module.config)) {
						this.cache.set(`${guildId}-${key}`, value);
					}
					break;
				}
			}
		}
	}

	public async set<T>(guildId: Snowflake, key: string, value: T): Promise<void> {
		const { prisma } = container.client;
		const { logger } = container;

		const guildSettings = await prisma.guildSettings.findFirst({
			where: {
				id: guildId,
			},
		});

		if (!guildSettings) throw new Error("Guild Settings not found!");

		let newModules = guildSettings.modules.map((module) => ModuleSchema.parse(module));

		function createModule(name: string) {
			newModules.push({
				name,
				enabled: true,
				config: {},
			});
		}

		if (newModules.length === 0) {
			createModule(this.options.moduleName);
		}

		for (const { index, module } of newModules.map((module, index) => ({ index, module }))) {
			if (module.name === this.options.moduleName) {
				logger.debug(`[ConfigStore] Setting ${key} to ${toString(value)}`);

				newModules = newModules.filter((m) => m.name !== this.options.moduleName);

				module.config[key] = value;

				newModules.push(module);
				break;
			}

			if (index === newModules.length - 1) {
				logger.debug(`[ConfigStore] Module ${this.options.moduleName} not found! Creating new module...`);

				createModule(this.options.moduleName);
			}
		}

		await prisma.guildSettings.update({
			where: {
				id: guildId,
			},
			data: {
				modules: {
					set: newModules,
				},
			},
		});

		logger.debug(`[ConfigStore] Updated in database!`);

		this.cache.set(`${guildId}-${key}`, value);
	}
}

export namespace ModuleConfigStore {
	export interface Options {
		moduleName: string;
	}
}
