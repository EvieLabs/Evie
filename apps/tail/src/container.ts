import { PrismaClient } from "@prisma/client";
import { Logger } from "@sapphire/plugin-logger";
import { container } from "tsyringe";
import { Env } from "./utils/Env";

export async function RegisterContainer() {
	container.register<Env>(Env, { useValue: new Env() });

	container.register<Logger>(Logger, {
		useValue: new Logger({
			level: container.resolve(Env).logLevel,
		}),
	});

	container.register<PrismaClient>(PrismaClient, {
		useValue: new PrismaClient(),
	});
}
