import { Environment } from "@evie/env";
import { Logger } from "@sapphire/plugin-logger";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { expressHandler } from "trpc-playground/handlers/express";
import { container } from "tsyringe";
import { z } from "zod";
import { createContext } from "../context";
import { publicProcedure, router } from "../trpc";
import { serviceRouter } from "./services";

const adminServerPort = Environment.getNumber("ADMIN_PORT", true) || 9990;

const appRouter = router({
	services: serviceRouter,
	health: publicProcedure.output(z.string()).query(() => "ok"),
});

const app = express();

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

app.listen(adminServerPort, () => {
	container.resolve(Logger).info(`Admin server listening on port \`${adminServerPort}\``);
});

export type AppRouter = typeof appRouter;
