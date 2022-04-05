import { EvieClient } from "#classes/EvieClient";
import "@sapphire/plugin-hmr/register";
import "@sapphire/plugin-logger/register";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import "dotenv/config";
import { rootFolder } from "./constants/paths";

/** The running EvieClient */
export const client = new EvieClient();

client.fetchPrefix = () => "slashies.";

console.log(`Root folder: ${rootFolder}`);

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

/** Login to the client */
client.login(process.env.CLIENT_TOKEN);
