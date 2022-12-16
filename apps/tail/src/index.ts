import "reflect-metadata";

import { PubSub, PubSubClientEvents } from "@evie/pubsub";
import { PrismaClient } from "@prisma/client";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import type { Logger } from "pino";
import { expressHandler } from "trpc-playground/handlers/express";
import { container } from "tsyringe";
import { z } from "zod";
import { RegisterContainer } from "./container";
import { createContext } from "./context";
import { MetaDataSchema } from "./routes/webhooks";
import { appRouter } from "./routes/_app";
import { Env } from "./utils/Env";
import { verifyToken } from "./utils/utils";

RegisterContainer();

const app = express();

app.use(express.json());

app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

(async () => {
	app.use(
		"/trpc-playground",
		await expressHandler({
			trpcApiEndpoint: "/trpc",
			playgroundEndpoint: "/trpc-playground",
			router: appRouter,
		}),
	);
})();

app.post("/webhooks/:token", async (req, res) => {
	const token = z.string().parse(req.params.token);

	const decoded = await verifyToken(token).catch(() => null);

	if (!decoded) {
		return res.status(401).send("Unauthorized");
	}

	const webhook = await container.resolve(PrismaClient).webhook.findUnique({
		where: {
			id: decoded.id,
		},
	});

	if (!webhook) {
		return res.status(404).send("Not found");
	}

	try {
		const payload = {
			metadata: MetaDataSchema.parse(webhook.metadata),
			payload: req.body,
			tag: webhook.tag,
		};

		container.resolve<Logger>("Logger").debug(payload, "Sending webhook payload to pubsub");

		await PubSub.getClient().publish(PubSubClientEvents.TailWebhook, payload);

		return res.status(200).send("ok");
	} catch (error) {
		return res.status(500).send("Internal server error");
	}
});

app.listen(container.resolve(Env).serverPort, () => {
	container.resolve<Logger>("Logger").info(`Admin server listening on port \`${container.resolve(Env).serverPort}\``);
});
