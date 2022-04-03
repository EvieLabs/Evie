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

import { dbUtils } from "#root/utils/database/index";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import Sentry from "@sentry/node";
import type { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.GuildCreate,
})
export class GuildCreateListener extends Listener {
  public async run(g: Guild) {
    console.log(
      `Got added to ${g.name} (${g.id}) trying to add to database... (Total guilds: ${g.client.guilds.cache.size})`
    );
    try {
      await dbUtils.createGuild(g);
    } catch (e) {
      Sentry.captureException(e);
      console.error(`Failed to add guild to database. Error: ${e}`);
    }
  }
}
