import { Precondition } from "@sapphire/framework";
import type { CommandInteraction, Message } from "discord.js";

export class OwnerOnlyPrecondition extends Precondition {
  public override chatInputRun(i: CommandInteraction) {
    return i.user.id === "97470053615673344"
      ? this.ok()
      : this.error({ message: "Only tristan can use this command!" });
  }
  public override messageRun(m: Message) {
    return m.author.id === "97470053615673344"
      ? this.ok()
      : this.error({ message: "Only tristan can use this command!" });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
