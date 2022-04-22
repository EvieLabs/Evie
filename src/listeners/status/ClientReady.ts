import { InfluxManager } from "#root/schedules/InfluxManager";
import { TempBans } from "#root/schedules/TempBans";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.ClientReady,
})
export class ClientReadyListener extends Listener {
  public async run(client: Client) {
    new TempBans("*/10 * * * *", client);
    if (process.env.INFLUX_URL) new InfluxManager("*/15 * * * * *", client);
  }
}
