import { WebSocket, WebSocketServer } from "ws";

export class Server extends WebSocketServer {
	public bots = new Set<WebSocket>();

	public constructor(port?: number) {
		super({ port: port });
		this.applyHooks();
	}

	private applyHooks() {
		this.on("connection", (socket) => {
			this.bots.add(socket);
			socket.on("close", () => this.bots.delete(socket));
		});
	}
}
