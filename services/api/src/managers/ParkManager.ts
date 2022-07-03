import { Collection } from "@discordjs/collection";
import type * as WebSocket from "ws";

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

export class ParkManager {
  private readonly dogs = new Collection<number, WebSocket>();

  /**
   * ## Subscribe to the park gateway.
   * @param id The dog's (shard's) id.
   * @param dog The dog (shard) to subscribe to the park gateway.
   */
  public subscribe(id: number, dog: WebSocket) {
    this.dogs.set(id, dog);
  }

  /**
   * ## Generate a nonce.
   * @returns A nonce.
   */
  public generateNonce() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * ### *request* **all** dogs (shards) for information.
   *
   * Different to *send* **all** dogs (shards) for information,
   * since this method waits for all dogs to respond and returns an array of responses.
   * @param payload The payload to request the park gateway with.
   */
  public async requestAll(payload: ParkGatewayPayload) {
    const prom = await Promise.all(
      this.dogs.map(async (dog, id) => {
        const response = await this.request(dog, payload);
        return { id, response };
      })
    );

    return prom.map(({ id, response }) => ({ id, response }));
  }

  /**
   * ### *request* **a** dog (shard) for information.
   * @param dog The dog (shard) to request for information.
   * @param payload The payload to request the park gateway with.
   * @returns The response from the dog (shard).
   * @throws If the dog (shard) does not respond.
   */
  public async request(dog: WebSocket, payload: ParkGatewayPayload) {
    this.dogs.forEach((dog) => {
      dog.send(JSON.stringify(payload));
    });
    const response = await new Promise<JSON>((resolve, reject) => {
      dog.on("message", (message) => {
        const response = JSON.parse(message.toString());
        if (response.n === payload.n) {
          resolve(response);
        } else {
          reject(new Error("Nonce mismatch."));
        }
      });
    });
    return response;
  }
}
