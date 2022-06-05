import { container } from "@sapphire/framework";
import type { Snowflake, User } from "discord.js";

export class VotePayload {
  constructor(
    private raw: {
      userSnowflake: Snowflake;
    }
  ) {}

  public user: User | null = null;

  public async init() {
    this.user = await container.client.users
      .fetch(this.raw.userSnowflake)
      .catch(() => null);
  }
}
