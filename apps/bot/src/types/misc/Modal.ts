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

import { SapphireClient } from "@sapphire/framework";
import { Modal } from "discord-modals";
import { CommandInteraction } from "discord.js";

declare module "discord-modals" {
  export function showModal(
    modal: Modal,
    options: {
      client: SapphireClient;
      interaction: CommandInteraction;
    }
  ): Promise<any>;
}
