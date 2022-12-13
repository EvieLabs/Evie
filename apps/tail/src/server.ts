import { Logger } from "@sapphire/plugin-logger";
import { container } from "tsyringe";
import { Data, WebSocketServer } from "ws";
import { Authentication } from "./handlers/authenticate";
import { ServiceManager } from "./handlers/ServiceManager";
import { AuthSchema } from "./schemas/auth";

export class Server extends WebSocketServer {
	private auth = container.resolve(Authentication);

	public constructor(port?: number) {
		super({ port: port });
		this.applyHooks();
	}

	private applyHooks() {
		this.on("connection", (socket, req) => {
			const timeout = setTimeout(() => socket.close(), 2000);

			const onMessage = async (data: Data) => {
				clearTimeout(timeout);
				try {
					const message = await AuthSchema.parseAsync(JSON.parse(data.toString()));
					const service = await this.auth.authenticateUser(message.d.token);

					container.resolve(ServiceManager).set(socket, service);
					socket.removeListener("message", onMessage);
				} catch (error) {
					container.resolve(Logger).debug(`disconnected ${req.socket.remoteAddress ?? "???"} due to ${error}`);
					socket.close();
				}

				timeout.refresh();
			};

			socket.on("message", onMessage);
		});
	}
}
