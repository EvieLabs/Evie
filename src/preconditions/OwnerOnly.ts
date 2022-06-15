import { botAdmins } from "@evie/config";
import { Precondition } from "@sapphire/framework";
import type { CommandInteraction, Message } from "discord.js";

export class OwnerOnlyPrecondition extends Precondition {
  public override chatInputRun(i: CommandInteraction) {
    return botAdmins.includes(i.user.id)
      ? this.ok()
      : this.error({ message: "Hey! You don't have permissions to use this!" });
  }
  public override messageRun(m: Message) {
    return botAdmins.includes(m.author.id)
      ? this.ok()
      : this.error({ message: "Hey! You don't have permissions to use this!" });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
