import { LinkRegex } from "#root/Constants";
import extractHostname from "#root/utils/parsers/extractHostname";
import { getSecret } from "@evie/config";
import { EventHook, EvieEmbed, Module } from "@evie/internal";
import { Events } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import * as Sentry from "@sentry/node";
import axios from "axios";
import type { Message } from "discord.js";
export class Phisherman extends Module {
	public constructor(context: Module.Context, options: Module.Options) {
		super(context, {
			...options,
			name: "Phisherman",
		});
	}

	@EventHook(Events.MessageCreate)
	public async scan(message: Message) {
		const links = LinkRegex.exec(message.content);
		if (!links) return;

		for (const element of links) {
			if (!(await this.checkDomain(extractHostname(element)))) return;

			try {
				await message.delete();
				void this.onPhish({
					successfullyDeleted: true,
					message,
					url: element,
				});
			} catch (error) {
				Sentry.captureException(error);
				void this.onPhish({
					successfullyDeleted: false,
					message,
					url: element,
				});
			}
		}
	}

	private async checkDomain(domain: string): Promise<boolean> {
		const token = getSecret("PHISHERMAN_TOKEN");

		if (!token) {
			this.container.logger.warn("WARNING `PHISHERMAN_TOKEN` IS NULL! PHISHING SCAMS WILL BE NOT SCANNED!");
			return false;
		}

		const res = await axios.get<{ classification: string; verifiedPhish: boolean }>(
			`https://api.phisherman.gg/v2/domains/check/${domain}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		this.container.logger.info(
			`[Phisherman] Scanned ${domain} with classification of ${res.data.classification} (phish: ${
				res.data.verifiedPhish ? "true" : "false"
			})`,
		);

		return res.data.verifiedPhish;
	}

	private async onPhish(phish: { successfullyDeleted: boolean; message: Message; url: string }) {
		if (!phish.message.guild) return;

		void this.log({
			embed: new EvieEmbed()
				.setColor("#4e73df")
				.setAuthor({
					name: `${phish.message.author.tag} (${phish.message.author.id})`,
					iconURL: phish.message.author.displayAvatarURL(),
				})
				.setDescription(
					phish.successfullyDeleted
						? await resolveKey(phish.message.guild, "modules/phish:successfullyDeleted")
						: await resolveKey(phish.message.guild, "modules/phish:failedToDelete"),
				)
				.addField(
					"Message",
					`${phish.message.content} ${
						phish.successfullyDeleted
							? await resolveKey(phish.message, "misc:jumpToContext", {
									message: phish.message,
							  })
							: await resolveKey(phish.message, "misc:jumpToContext", {
									message: phish.message,
							  })
					}`,
				)
				.addField(await resolveKey(phish.message.guild, "modules/phish:linkTrigger"), phish.url),
			guild: phish.message.guild,
		});
	}
}
