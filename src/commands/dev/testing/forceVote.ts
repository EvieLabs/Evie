import { Emojis, EvieEvent } from "#root/Enums";
import { VotePayload } from "@evie/shapers";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "forcevote",
  description: "Force a vote on a user",
  preconditions: ["OwnerOnly"],
  aliases: ["fv"],
})
export class ForceVote extends Command {
  public override async messageRun(message: Message, args: Args) {
    const user = await args.pick("user").catch(() => message.author);
    const test = await args.pick("boolean").catch(() => false);

    const payload = new VotePayload({
      userSnowflake: user.id,
      test,
      serviceName: "Internal",
      voteLink: message.url,
      emoji: Emojis.slashCommand,
    });

    await payload.init();

    this.container.client.emit(EvieEvent.Vote, payload);

    await message.reply("Done!");
  }
}
