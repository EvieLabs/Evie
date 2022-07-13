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
		container.client.once(Events.ClientReady, () => {
			container.logger.debug("[ConfigStore] Initializing...");
		});
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
