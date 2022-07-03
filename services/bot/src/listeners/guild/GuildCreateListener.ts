import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildCreate,
})
export class GuildCreateListener extends Listener {
  public async run(guild: Guild) {
    return void (await this.container.client.db.FetchGuildSettings(guild));
  }
}
