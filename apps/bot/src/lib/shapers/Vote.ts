import { container } from "@sapphire/framework";
import type { Snowflake, User } from "discord.js";

export class VotePayload {
	public user: User | null = null;

	public readonly test: boolean;
	public readonly serviceName: string;
	public readonly voteLink: string;
	public readonly voteHyperlink: string;
	public readonly emoji: string;

	constructor(private raw: RawVotePayload) {
		this.test = raw.test;
		this.serviceName = raw.serviceName;
		this.voteLink = raw.voteLink;
		this.emoji = raw.emoji;
		this.voteHyperlink = `[${this.serviceName}](${this.voteLink})`;
	}

	public async init() {
		this.user = await container.client.users.fetch(this.raw.userSnowflake).catch(() => null);
	}
}

export interface RawVotePayload {
	userSnowflake: Snowflake;
	test: boolean;
	serviceName: string;
	voteLink: string;
	emoji: string;
}
