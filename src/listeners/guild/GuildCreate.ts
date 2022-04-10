import { dbUtils } from "#root/utils/database/index";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import * as Sentry from "@sentry/node";
import type { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildCreate,
})
export class GuildCreateListener extends Listener {
  public async run(g: Guild) {
    console.log(
      `Got added to ${g.name} (${g.id}) trying to add to database... (Total guilds: ${g.client.guilds.cache.size})`
    );
    try {
      await dbUtils.createGuild(g);
    } catch (e) {
      Sentry.captureException(e);
    }
  }
}
