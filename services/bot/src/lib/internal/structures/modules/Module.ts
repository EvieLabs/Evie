/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-namespace */
import { container, Piece } from "@sapphire/framework";
import { captureException } from "@sentry/node";
import type { Guild, MessageEmbed } from "discord.js";

export function EventHook(event: string) {
	return function hook(target: Module, _propertyKey: string, descriptor: PropertyDescriptor) {
		if (!(typeof descriptor.value === "function")) throw new Error("@EventHook can only be used on methods");

		container.logger.info(
			`[${target.constructor.name}] Hooking Gateway event "${event}" into method "${descriptor.value as string}"`,
		);

		container.client.on(event, descriptor.value.bind(target));
	};
}

export class Module<O extends Module.Options = Module.Options> extends Piece<O> {
	public constructor(context: Piece.Context, options: Module.Options) {
		super(context, options);
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
