import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { GuildBan } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildBanAdd,
})
export class GuildBanAddListener extends Listener {
  public async run({ guild, user, reason }: GuildBan) {
    this.container.client.guildLogger.modAction(guild, {
      action: "Ban",
      target: user,
      reason: reason
        ? `${reason} (Ban not made via Evie)`
        : "No reason provided.",
    });
  }
}
