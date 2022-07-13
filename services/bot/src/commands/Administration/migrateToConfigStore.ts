import { Emojis } from "#root/Enums";
import type { AirportWelcome } from "#root/listeners/modules/Airport/Welcome";
import type { Phisherman } from "#root/listeners/modules/Phisherman";
import { inlineCode } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
	name: "migrateToConfigStore",
	description: "Copy the config from the model based config store to the new config store",
	preconditions: ["OwnerOnly"],
	aliases: ["mtcs"],
})
export class MigrateToConfigStore extends Command {
	public override async messageRun(message: Message) {
		const airport = this.container.stores.get("listeners").find((piece) => piece.name === "airportWelcome") as
			| AirportWelcome
			| undefined;
		const phisherman = this.container.stores.get("listeners").find((piece) => piece.name === "phisherman") as
			| Phisherman
			| undefined;

		if (!airport || !phisherman) {
			return message.channel.send(
				`Could not find all pieces, found ${airport ? "airport" : ""} ${phisherman ? "phisherman" : ""}`,
			);
		}

		void message.channel.send(`${Emojis.loading} Found all pieces! Migrating config...`);

		const oldAirportSettings = await this.container.client.prisma.airportSettings.findMany();

		void message.channel.send(`Found ${inlineCode(oldAirportSettings.length.toString())} airport settings'!`);

		for (const { index, oldAirportSetting } of oldAirportSettings.map((oldAirportSetting, index) => ({
			index,
			oldAirportSetting,
		}))) {
			if (index % 5 === 0 && index !== 0) {
				void message.channel.send(
					`${Emojis.loading} Taking a break... ${inlineCode(index.toString())}/${inlineCode(
						oldAirportSettings.length.toString(),
					)}`,
				);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}

			await airport.config.set(oldAirportSetting.guildId, {
				channel: oldAirportSetting.channel,
				arrives: oldAirportSetting.arrives,
				arriveMessage: oldAirportSetting.arriveMessage,
				departs: oldAirportSetting.departs,
				departMessage: oldAirportSetting.departMessage,
				joinRole: oldAirportSetting.joinRole,
				giveJoinRole: oldAirportSetting.giveJoinRole,
				ping: oldAirportSetting.ping,
			});
		}

		const oldModSettings = await this.container.client.prisma.moderationSettings.findMany();

		void message.channel.send(`Found ${inlineCode(oldModSettings.length.toString())} moderation settings'!`);

		for (const { index, oldModSetting } of oldModSettings.map((oldModSetting, index) => ({ index, oldModSetting }))) {
			if (index % 5 === 0 && index !== 0) {
				void message.channel.send(
					`${Emojis.loading} Taking a break... ${inlineCode(index.toString())}/${inlineCode(
						oldModSettings.length.toString(),
					)}`,
				);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}

			await phisherman.config.set(oldModSetting.guildId, {
				enabled: oldModSetting.phishingDetection,
			});
		}

		return void (await message.reply(`Migrated config to new store!`));
	}
}
