import "dotenv/config";
import "module-alias/register";

import { EvieClient } from "#classes/EvieClient";
import {
  ApplicationCommandRegistries,
  container,
  RegisterBehavior,
} from "@sapphire/framework";
import "@sapphire/plugin-api/register";
import "@sapphire/plugin-hmr/register";
import "@sapphire/plugin-logger/register";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { rootFolder } from "./constants/paths";

/** The running EvieClient */
const client = new EvieClient();

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.Overwrite
);

container.logger.info(`Root folder: ${rootFolder}`);

if (process.env.SENTRY_URL) {
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    integrations: [
      new Sentry.Integrations.Modules(),
      new Sentry.Integrations.FunctionToString(),
      new Sentry.Integrations.LinkedErrors(),
      new Sentry.Integrations.Console(),
      new Sentry.Integrations.Http({ breadcrumbs: true, tracing: true }),
      new RewriteFrames({ root: rootFolder }),
    ],
  });
}

client.on("debug", (m) => container.logger.debug(m));

/** Login to the client */
client.login(process.env.CLIENT_TOKEN);
