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

import { Enumerable } from "@sapphire/decorators";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Intents } from "discord.js";
import { EvieGuildLogger } from "./EvieGuildLogger";
import { EviePunish } from "./EviePunish";
import { Phisherman } from "./Phisherman";

export class EvieClient extends SapphireClient {
  /** The phisherman instance used for checking domains */
  @Enumerable(false)
  public override phisherman = new Phisherman();

  /** The EviePunish instance used for punishing people */
  @Enumerable(false)
  public override punishments = new EviePunish();

  /** The EvieGuildLogger instance used for logging events in a specified channel in a guild */
  @Enumerable(false)
  public override guildLogger = new EvieGuildLogger(this);

  public constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      logger: {
        level: LogLevel.Info,
      },
      loadMessageCommandListeners: true,
      shards: "auto",
      allowedMentions: { users: [], roles: [] },
    });
  }
}

declare module "discord.js" {
  interface Client {
    readonly phisherman: Phisherman;
    readonly punishments: EviePunish;
    readonly guildLogger: EvieGuildLogger;
  }
}
