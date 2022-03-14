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

import { EvieEmbed, StatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { TSMPApplyModal } from "#root/constants/modals";
import { makeApplicationChannel } from "#root/utils/tsmp/applications";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import {
  ButtonInteraction,
  Interaction,
  ModalSubmitInteraction,
  Snowflake,
  SnowflakeUtil,
} from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.InteractionCreate,
})
export class TSMPApplicationButton extends Listener {
  public async run(i: Interaction) {
    if (!(i instanceof ButtonInteraction)) return;
    if (!i.inCachedGuild()) return;
    if (!i.channel) return;
    if (i.channel.id != process.env.TSMP_APPLY_CHANNEL_ID) return;
    const generatedState = SnowflakeUtil.generate();

    await i.showModal(TSMPApplyModal(generatedState));
    this.waitForModal(i, generatedState);
  }

  private async waitForModal(ogi: ButtonInteraction, stateflake: Snowflake) {
    const modal = (await ogi
      .awaitModalSubmit({
        filter: (i) => i.customId === `tsmp_applymodal_${stateflake}`,
        time: 900000,
      })
      .catch(() => {
        StatusEmbed(StatusEmoji.FAIL, `Application Timed Out`, ogi);
      })) as ModalSubmitInteraction;

    if (!modal) return;
    if (!modal.fields) return;
    if (!modal.inCachedGuild()) return;

    const whyJoin = modal.fields.getTextInputValue("whyjoin");
    // const howMuch = modal.fields.getTextInputValue("howmuch");

    const channel = await makeApplicationChannel(modal.member);

    if (!channel) {
      StatusEmbed(StatusEmoji.FAIL, `Couldn't make application channel`, ogi);
      return;
    }

    if (!process.env.TSMP_STAFF_ROLE_ID) {
      StatusEmbed(StatusEmoji.FAIL, `No staff role set`, ogi);
      return;
    }

    const application = await channel.send({
      content: `<@&${process.env.TSMP_STAFF_ROLE_ID}>`,
      embeds: [
        (
          await EvieEmbed(modal.guild)
        )
          .addFields([
            {
              name: "Why do you want to join?",
              value: whyJoin,
            },
            // {
            //   name: "How much time do you want to contribute?",
            //   value: howMuch,
            // },
          ])
          .setTitle("New Application"),
      ],
      allowedMentions: { roles: [process.env.TSMP_STAFF_ROLE_ID] },
    });
    return await StatusEmbed(
      StatusEmoji.SUCCESS,
      `Application Sent! The team will review it in ${channel}`,
      modal
    );
  }
}
