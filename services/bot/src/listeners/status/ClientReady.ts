import { ShardStatsManager } from "#root/schedules/ShardStatsManager";
import { TempBans } from "#root/schedules/TempBans";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.ClientReady,
})
export class ClientReadyListener extends Listener {
  public async run() {
    new TempBans("*/10 * * * *");
    new ShardStatsManager("*/15 * * * * *")
  }
}
