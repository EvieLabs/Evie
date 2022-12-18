import { IService, Service } from "./Service";
import { ServiceType } from "./ServiceType";

export interface IBotService extends IService {
	type: "bot";
	data: {
		shardId: number;
		guildCount: number;
		memberCount: number;
		discordPing: number;
	};
}

export class BotService extends Service {
	public declare type: typeof ServiceType[keyof typeof ServiceType];

	/**
	 * The shard ID of the bot.
	 */
	public shardId: number;

	/**
	 * The guild count the shard is serving.
	 */
	public guildCount: number;

	/**
	 * The member count the shard is serving.
	 */
	public memberCount: number;

	/**
	 * The ping from the shard to Discord.
	 */
	public discordPing: number;

	public override uuid: string;

	public constructor(data: IBotService, ping: number) {
		super(data, ping);
		this.type = ServiceType.Bot;
		this.shardId = data.data.shardId;
		this.guildCount = data.data.guildCount;
		this.memberCount = data.data.memberCount;
		this.discordPing = data.data.discordPing;
		this.uuid = `${this.name}:${this.shardId}`;
	}

	public override getMetrics(): string[] {
		return [
			...super.getMetrics(),
			`# HELP tail_service_guild_count The guild count of the service.`,
			`# TYPE tail_service_guild_count gauge`,
			`tail_service_guild_count{service="${this.uuid}"} ${this.guildCount}`,
			`# HELP tail_service_members_count The members count of the service.`,
			`# TYPE tail_service_members_count gauge`,
			`tail_service_members_count{service="${this.uuid}"} ${this.memberCount}`,
		];
	}
}
