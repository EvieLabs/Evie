import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { GuildMember } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildMemberRemove,
})
export class GuildMemberRemoveListener extends Listener {
  public async run(member: GuildMember) {
    member.client.airport.onLeave(member);
  }
}
