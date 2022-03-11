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
import "dotenv/config";

/** The Sapphire Client */
export const client = new EvieClient();

client.fetchPrefix = () => "slashies.";

/** Login to the client */
client.login(process.env.CLIENT_TOKEN);
