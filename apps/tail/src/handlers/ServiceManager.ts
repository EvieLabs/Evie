import type { Service } from "@prisma/client";
import { Logger } from "@sapphire/plugin-logger";
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";
import { container } from "tsyringe";
import type { WebSocket } from "ws";
import { PayloadSchema } from "../schemas/payload";

export type ServiceManagerEvents = {
	clientLogin: [WebSocket, Service];
};

export class ServiceManager extends AsyncEventEmitter<ServiceManagerEvents> {
	private services = new Map<WebSocket, Service>();

	public set(socket: WebSocket, service: Service) {
		this.services.set(socket, service);
		this.applyHooks(socket);
		this.emit("clientLogin", socket, service);

		container.resolve(Logger).debug(`connected ${service?.name} ${this.services.size} remaining`);
	}

	public get(socket: WebSocket) {
		return this.services.get(socket);
	}

	public delete(socket: WebSocket) {
		const service = this.services.get(socket);
		this.services.delete(socket);

		container.resolve(Logger).debug(`disconnected ${service?.name} ${this.services.size} remaining`);
	}

	public send(serviceId: string, data: unknown) {
		return new Promise<void>((resolve, reject) => {
			for (const [socket, service] of this.services) {
				if (service.id !== serviceId) continue;

				socket.send(JSON.stringify({ t: "DATA", d: data }));
				resolve();
				break;
			}

			reject(new Error(`Service ${serviceId} not found`));
		});
	}

	private applyHooks(socket: WebSocket) {
		socket.on("close", () => this.delete(socket));
		socket.on("error", () => this.delete(socket));

		socket.on("message", async (data) => {
			try {
				const message = await PayloadSchema.parseAsync(JSON.parse(data.toString()));

				socket.send(JSON.stringify({ t: "ACK", d: message.d }));
			} catch (error) {
				socket.send(JSON.stringify({ t: "ERROR", d: error }));
			}
		});
	}
}
