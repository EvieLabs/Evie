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

import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class OwnerOnlyPrecondition extends Precondition {
  public override chatInputRun(i: CommandInteraction) {
    return i.user.id === "97470053615673344"
      ? this.ok()
      : this.error({ message: "Only tristan can use this command!" });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
