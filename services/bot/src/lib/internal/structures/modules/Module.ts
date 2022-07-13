/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-namespace */
import { container, Piece } from "@sapphire/framework";
import { s } from "@sapphire/shapeshift";
import { captureException } from "@sentry/node";
import type { Guild, MessageEmbed, Snowflake } from "discord.js";

export function EventHook(event: string) {
	return function hook(target: Module, _propertyKey: string, descriptor: PropertyDescriptor) {
		if (!(typeof descriptor.value === "function")) throw new Error("@EventHook can only be used on methods");

		container.logger.info(
			`[${target.constructor.name}] Hooking Gateway event "${event}" into method "${descriptor.value as string}"`,
		);

		container.client.on(event, descriptor.value.bind(target));
	};
}

export const moduleValidator = s.object({
	name: s.string,
	config: s.any,
});

export const modulesValidator = s.array(moduleValidator);

export class Module<O extends Module.Options = Module.Options> extends Piece<O> {
	public constructor(context: Piece.Context, options: Module.Options) {
		super(context, options);
		// @ts-expect-error Read only
		this.options = options;
		// @ts-expect-error Read only
		this.name = options.name;
	}

	private async fetchGuildModules(guildId: Snowflake) {
		try {
			const guild = await this.container.client.prisma.guildSettings.findFirst({
				where: {
					id: guildId,
				},
			});

			if (!guild) return [];

			return modulesValidator.parse(guild.modules);
		} catch (error) {
			throw error;
		}
	}

	private async createBaseConfig(guildId: Snowflake) {
		try {
			const guild = await this.container.client.prisma.guildSettings.update({
				where: {
					id: guildId,
				},
				data: {
					modules: {
						create: {
							name: this.name,
							config: {},
						},
					},
				},
			});

			return guild;
		} catch (error) {
			throw error;
		}
	}

	public async updateConfig(
		guildId: Snowflake,
		config: {
			[key: string]: unknown;
		},
	) {
		try {
			const validConfig = moduleValidator.parse({
				name: this.name,
				config,
			});

			const existingGuild = await this.container.client.prisma.guildSettings.findFirst({
				where: { id: guildId },
				select: { modules: true },
			});

			const validModules = modulesValidator.parse(existingGuild?.modules);

			const existingModule = validModules.find((module) => module.name === this.name);

			if (existingModule) {
				validModules.splice(validModules.indexOf(existingModule), 1, validConfig);
			} else {
				validModules.push(validConfig);
			}

			const guild = await this.container.client.prisma.guildSettings.update({
				where: {
					id: guildId,
				},
				data: {
					modules: {
						set: validModules,
					},
				},
			});

			return guild;
		} catch (error) {
			throw error;
		}
	}

	public async _getConfig(guildId: Snowflake): Promise<unknown> {
		try {
			const modules = await this.fetchGuildModules(guildId);

			const module = modules.find((module) => module.name === this.name);

			if (!module) {
				await this.createBaseConfig(guildId);

				return await this._getConfig(guildId);
			}

			return module.config as unknown;
		} catch (error) {
			throw error;
		}
	}

	public async log(opts: { embed: MessageEmbed; guild: Guild }, modLog = false) {
		opts.embed.setTimestamp();
		opts.embed.setFooter({
			text: this.name ? `${this.name}` : "Evie Internal",
		});

		try {
			modLog
				? await container.client.guildLogger.sendEmbedToModChannel(opts.guild, opts.embed)
				: await container.client.guildLogger.sendEmbedToLogChannel(opts.guild, opts.embed);
			return;
		} catch (e) {
			return void captureException(e);
		}
	}
}

export interface ModuleOptions extends Piece.Options {
	description?: string;
}

export namespace Module {
	export type Options = ModuleOptions;
	export type Context = Piece.Context;
}
