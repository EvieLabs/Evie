import "reflect-metadata";

import { Environment } from "@evie/env";
import { Logger } from "@sapphire/plugin-logger";
import { container } from "tsyringe";
import { Server } from "./server";

const port = Environment.getNumber("PORT", true) ?? 9991;

container.register<Server>(Server, { useValue: new Server(port) });
container.register<Logger>(Logger, {
	useValue: new Logger({
		level: Environment.getBoolean("VERBOSE", true, true) ? 20 : 30,
	}),
});

const server = container.resolve(Server);

server.on("listening", () => {
	container.resolve(Logger).info(`Listening on port ${port}`);
});
