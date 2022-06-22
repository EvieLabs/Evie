import { InfluxManager } from "#root/schedules/InfluxManager";
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
    if (process.env.INFLUX_URL) new InfluxManager("*/15 * * * * *");
  }
}
