import { config } from "dotenv";
config({ path: "../../.env" });

import { Environment } from "@evie/env";
import { EvieClient } from "@evie/internal";
import { ApplicationCommandRegistries, container, RegisterBehavior } from "@sapphire/framework";
import "@sapphire/plugin-i18next/register";
import "@sapphire/plugin-logger/register";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { rootFolder } from "./constants/paths";
import { production } from "./lib/config";

/** The running EvieClient */
const client = new EvieClient();

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

container.logger.debug("Initializing Sentry...");

Sentry.init({
	dsn: Environment.getString("SENTRY_URL", true) ?? undefined,
	integrations: [
		new Sentry.Integrations.Modules(),
		new Sentry.Integrations.FunctionToString(),
		new Sentry.Integrations.LinkedErrors(),
		new Sentry.Integrations.Console(),
		new Sentry.Integrations.Http({ breadcrumbs: true, tracing: true }),
		new RewriteFrames({ root: rootFolder }),
	],
	beforeSend: (event) => {
		if (production) return event;
		container.logger.error(event);
		return null;
	},
	onFatalError: (error: Error) => container.logger.fatal(error),
});

client.on("debug", (m) => container.logger.debug(m));

container.logger.debug("Logging in to Discord...");
/** Login to the client */
void client.login(Environment.getString("DISCORD_TOKEN"));
