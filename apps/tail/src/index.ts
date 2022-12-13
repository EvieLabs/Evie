import "reflect-metadata";

import { Logger } from "@sapphire/plugin-logger";
import { container } from "tsyringe";
import { RegisterContainer } from "./container";
import { Server } from "./server";

// Register container
RegisterContainer();

const server = container.resolve(Server);

// Start wss
server.on("listening", () => {
	const info = server.address();
	if (typeof info === "string") return;

	container.resolve(Logger).info(`Listening on port \`${info.port}\``);
});

// Register admin api
import "./admin/routes/_app";
