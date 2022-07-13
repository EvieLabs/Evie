/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ModuleSchema } from "#root/Constants";
import { container, Events } from "@sapphire/framework";
import type { Snowflake } from "discord.js";

export class ModuleConfigStore<ConfigType> {
	public constructor(public readonly options: ModuleConfigStore.Options) {
		this.options.moduleName = options.moduleName.toLowerCase();
		this.init();
	}

	private readonly cache = new Map<string, unknown>();

	public get(guildId: Snowflake): ModuleConfigStore.Output<ConfigType> | null {
		const cached = this.cache.get(`${guildId}`);
		if (cached) return cached as ModuleConfigStore.Output<ConfigType>;
		return null;
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
		const { prisma } = container.client;

		const guildSettingss = await prisma.guildSettings.findMany({
			where: {
				id: {
					in: guildIds,
				},
			},
		});

		for (const guildSettings of guildSettingss) {
			const modules = guildSettings.modules.map((module) => ModuleSchema.parse(module));

			for (const module of modules) {
				if (module.name === this.options.moduleName) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					this.cache.set(`${guildSettings.id}`, module.config);
					break;
				}
			}
		}
	}

	public async set(guildId: Snowflake, config: ModuleConfigStore.Output<ConfigType>): Promise<void> {
		const { prisma } = container.client;
		const { logger } = container;

		const guildSettings = await prisma.guildSettings.findFirst({
			where: {
				id: guildId,
			},
		});

		if (!guildSettings) throw new Error("Guild Settings not found!");

		const newModules = guildSettings.modules.map((module) => ModuleSchema.parse(module));

		function createModule(name: string) {
			newModules.push({
				name,
				config: config,
			});
		}

		if (newModules.length === 0) {
			createModule(this.options.moduleName);
		}

		for (const { index, module } of newModules.map((module, index) => ({ index, module }))) {
			if (module.name === this.options.moduleName) {
				newModules[index].config = config;
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

		this.cache.set(`${guildId}`, newModules);
	}
}

export namespace ModuleConfigStore {
	export interface Options {
		moduleName: string;
	}
	export type Output<T> = {
		[K in keyof T]: Output<T[K]> | null;
	};
}
