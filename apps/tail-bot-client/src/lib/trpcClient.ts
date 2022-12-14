import type { AppRouter } from "@evie/tail";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { App } from "disploy";

export const TailClient = (
	{ app }: { app: App }, // ignore this callback, will be rm'd when the disploy global context is implemented
) =>
	createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				url: app.env.get("TAIL_URL") ?? "http://localhost:9990/trpc",
				headers: {
					Authorization: `Bearer ${app.env.get("TAIL_TOKEN")}`,
				},
			}),
		],
	});
