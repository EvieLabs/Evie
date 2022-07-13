/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ModuleSchema } from "#root/Constants";
import { container, Events } from "@sapphire/framework";
import type { ObjectValidator } from "@sapphire/shapeshift";
import type { Snowflake } from "discord.js";

export class ModuleConfigStore<SchemaType> {
	public schema!: ObjectValidator<SchemaType>;

	public constructor(public readonly options: ModuleConfigStore.Options<SchemaType>) {
		this.options.moduleName = options.moduleName.toLowerCase();
		this.schema = options.schema;
		this.init();
	}

	private readonly cache = new Map<string, unknown>();

	public get(guildId: Snowflake): ModuleConfigStore.Nullish<SchemaType> | null {
		const cached = this.cache.get(`${guildId}`);
		if (cached) return cached as ModuleConfigStore.Nullish<SchemaType>;
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

	public async set(guildId: Snowflake, config: ModuleConfigStore.Nullish<SchemaType>): Promise<void> {
		const { prisma } = container.client;
		const { logger } = container;

		const guildSettings = await prisma.guildSettings.findFirst({
			where: {
				id: guildId,
			},
		});

		if (!guildSettings) throw new Error("Guild Settings not found!");

		const newModules = guildSettings.modules.map((module) => ModuleSchema.parse(module));

		function createModule(name: string, schema: ObjectValidator<SchemaType>) {
			newModules.push({
				name,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				config: schema.parse(config),
			});
		}

		if (newModules.length === 0) {
			createModule(this.options.moduleName, this.schema);
		}

		for (const { index, module } of newModules.map((module, index) => ({ index, module }))) {
			if (module.name === this.options.moduleName) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				newModules[index].config = this.schema.parse(config);
				break;
			}

			if (index === newModules.length - 1) {
				logger.debug(`[ConfigStore] Module ${this.options.moduleName} not found! Creating new module...`);

				createModule(this.options.moduleName, this.schema);
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
	export interface Options<SchemaType> {
		moduleName: string;
		schema: ObjectValidator<SchemaType>;
	}
	export type Nullish<T> = {
		[K in keyof T]: Nullish<T[K]> | null;
	};
}
