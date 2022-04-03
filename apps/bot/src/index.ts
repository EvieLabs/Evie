/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { EvieClient } from "#classes/EvieClient";
import "@sapphire/plugin-hmr/register";
import "@sapphire/plugin-logger/register";
import { RewriteFrames } from "@sentry/integrations";
import Sentry from "@sentry/node";
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
