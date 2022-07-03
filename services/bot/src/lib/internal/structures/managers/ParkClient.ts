import { container } from "@sapphire/framework";
import { WebSocket } from "ws";

interface ParkGatewayPayload {
  /**
   * Request events **broadcasted by the park**.
   */
  r?: string;
  /**
   * Data **sent from the dogs**.
   */
  d?: JSON;
  /**
   * Nonce used to **verify** the payload.
   */
  n: string;
}

export class ParkClient {
  private socket = new WebSocket(this.parkGatewayURI);

  public constructor(private parkGatewayURI: string) {
    container.logger.debug("Initializing Park Client");
    this.init();
  }

  public async init() {
    this.socket.addEventListener("open", () => {
      if (!container.client.shard) return;
      this.socket.send(container.client.shard.ids[0].toString());
      container.logger.debug("Connected to Park Gateway");
    });

    this.socket.addEventListener("message", (message) => {
      const buffer = JSON.parse(
        (message.data as string | Buffer | Buffer[]).toString()
      ) as ParkGatewayPayload;

      switch (buffer.r) {
        case "stats": {
          return this.socket.send(
            JSON.stringify({
              n: buffer.n,
              d: container.client.stats.shardStats(),
            })
          );
        }
      }
    });
  }
}
