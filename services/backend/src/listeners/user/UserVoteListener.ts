import { EvieEmbed } from "#root/classes/EvieEmbed";
import { EvieEvent } from "#root/Enums";
import type { VotePayload } from "@evie/shapers";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
  once: false,
  event: EvieEvent.Vote,
})
export class UserVoteListener extends Listener {
  public async run({
    user,
    serviceName,
    voteHyperlink,
    emoji,
    test,
  }: VotePayload) {
    if (!user) return;
    this.container.logger.info(`${user.username} voted!`);
    this.container.client.kennel.send({
      embeds: [
        new EvieEmbed() //
          .setTitle(`${emoji ?? ""} Vote from ${serviceName}`)
          .setDescription(
            `Tysm ${user} (${user.username}) for voting on ${voteHyperlink}!`
          )
          .setFooter({ text: test ? "Test vote" : "" }),
      ],
    });
  }
}
