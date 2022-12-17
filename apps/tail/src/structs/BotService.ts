import { IMiscService, MiscService } from "./MiscService";

export interface IBotService extends IMiscService {
	data: {
		shardId: number;
		guildCount: number;
	};
}

export class BotService extends MiscService {
	/**
	 * The shard ID of the bot.
	 */
	public shardId: number;

	/**
	 * The guild count the shard is serving.
	 */
	public guildCount: number;

	public override uuid: string;

	public constructor(data: IBotService, ping: number) {
		super(data, ping);
		this.shardId = data.data.shardId;
		this.guildCount = data.data.guildCount;
		this.uuid = `${this.name}:${this.shardId}`;
	}

	public override getMetrics(): string[] {
		return [
			...super.getMetrics(),
			`# HELP tail_service_guild_count The guild count of the service.`,
			`# TYPE tail_service_guild_count gauge`,
			`tail_service_guild_count{service="${this.uuid}"} ${this.guildCount}`,
		];
	}
}
