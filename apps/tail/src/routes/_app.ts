import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { webhooksRouter } from "./webhooks";

export const appRouter = router({
	webhooks: webhooksRouter,
	health: publicProcedure.output(z.string()).query(() => "ok"),
});

export type AppRouter = typeof appRouter;
