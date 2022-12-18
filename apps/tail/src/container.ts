import { PubSubClient, PubSubClientEvents } from "@evie/pubsub";
import { PrismaClient } from "@prisma/client";
import pino, { Logger } from "pino";
import { container } from "tsyringe";
import { ServiceManager } from "./managers/ServiceManager";
import { Env } from "./utils/Env";

export async function RegisterContainer() {
	container.register<Env>(Env, { useValue: new Env() });

	container.register<Logger>("Logger", {
		useValue: pino({
			level: container.resolve(Env).logLevel,
		}),
	});

	container.register<PrismaClient>(PrismaClient, { useValue: new PrismaClient() });

	container.register<PubSubClient>(PubSubClient, {
		useValue: new PubSubClient({
			intents: [PubSubClientEvents.Discovered],
			tail: true,
		}),
	});

	container.register<ServiceManager>(ServiceManager, { useValue: new ServiceManager() });
}
