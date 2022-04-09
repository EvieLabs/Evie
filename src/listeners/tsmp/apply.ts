import {
  EvieEmbed,
  ReplyStatusEmbed,
  StatusEmoji,
} from "#root/classes/EvieEmbed";
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
        ReplyStatusEmbed(StatusEmoji.FAIL, `Application Timed Out`, ogi);
      })) as ModalSubmitInteraction;

    if (!modal) return;
    if (!modal.fields) return;
    if (!modal.inCachedGuild()) return;

    const whyJoin = modal.fields.getTextInputValue("whyjoin");
    // const howMuch = modal.fields.getTextInputValue("howmuch");

    const channel = await makeApplicationChannel(modal.member);

    if (!channel) {
      ReplyStatusEmbed(
        StatusEmoji.FAIL,
        `Couldn't make application channel`,
        modal
      );
      return;
    }

    if (!process.env.TSMP_STAFF_ROLE_ID) {
      ReplyStatusEmbed(StatusEmoji.FAIL, `No staff role set`, modal);
      return;
    }

    const application = await channel.send({
      content: `Hey, <@&${process.env.TSMP_STAFF_ROLE_ID}> new application from ${modal.user}!`,
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
      allowedMentions: {
        roles: [process.env.TSMP_STAFF_ROLE_ID],
        users: [modal.user.id],
      },
    });
    return await ReplyStatusEmbed(
      StatusEmoji.SUCCESS,
      `Application Sent! The team will review it in ${channel}`,
      modal
    );
  }
}
