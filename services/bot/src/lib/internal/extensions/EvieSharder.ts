/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { rootFolder } from "#root/constants/paths";
import { GuildStoreService, VoteManagerService } from "@evie/grpc";
import { ShardingManager } from "discord.js";
import { GuildStoreServer } from "../structures/grpc/GuildStoreServer";
import { VoteManagerServer } from "../structures/grpc/VoteManagerServer";
import { EvieRPC } from "./EvieRPC";

export class EvieSharder extends ShardingManager {
	private static instance: EvieSharder;

	public override readonly grpc = new EvieRPC([
		[GuildStoreService, GuildStoreServer],
		[VoteManagerService, VoteManagerServer],
	]);

	private constructor() {
		super(`${rootFolder}/dist/bot.js`, {
			token: process.env.CLIENT_TOKEN,
		});
	}

	public static getInstance(): EvieSharder {
		if (!EvieSharder.instance) {
			EvieSharder.instance = new EvieSharder();
		}

		return EvieSharder.instance;
	}

	public override shardForGuildId(guildId: string | number | bigint) {
		const shardId = Number(BigInt(guildId) >> 22n) % this.shards.size;
		if (shardId < 0) throw new Error("SHARDING_SHARD_MISCALCULATION");
		const shard = this.shards.get(shardId);
		if (!shard) throw new Error("SHARDING_SHARD_NOT_FOUND");
		return shard;
	}

	override async fetchMergeClientValues(prop: string): Promise<unknown> {
		try {
			const values = await this.fetchClientValues(prop);

			const value = values.reduce((acc, value) => {
				switch (typeof value) {
					case "number":
						switch (typeof acc) {
							case "number":
								return acc + value;
							default:
								throw new Error(`not a number: ${typeof acc}`);
						}
					default:
						throw new Error(`not a number: ${typeof value}`);
				}
			}, 0);

			return value as number;
		} catch (error) {
			throw error;
		}
	}
}

declare module "discord.js" {
	interface ShardingManager {
		fetchMergeClientValues(prop: string): Promise<unknown>;
		shardForGuildId(guildId: string | number | bigint): Shard;
		readonly grpc: EvieRPC;
	}
}
