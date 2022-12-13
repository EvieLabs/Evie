import { Environment } from "@evie/env";
import { PrismaClient } from "@prisma/client";
import { Logger } from "@sapphire/plugin-logger";
import { container } from "tsyringe";
import { Authentication } from "./handlers/authenticate";
import { ServiceManager } from "./handlers/ServiceManager";
import { Server } from "./server";

export async function RegisterContainer() {
	const port = Environment.getNumber("PORT", true) ?? 9991;

	container.register<Logger>(Logger, {
		useValue: new Logger({
			level: Environment.getBoolean("VERBOSE", true, true) ? 30 : 20,
		}),
	});

	container.register<PrismaClient>(PrismaClient, {
		useValue: new PrismaClient(),
	});

	container.register<Authentication>(Authentication, { useValue: new Authentication() });

	container.register<ServiceManager>(ServiceManager, { useValue: new ServiceManager() });

	container.register<Server>(Server, { useValue: new Server(port) });
}
