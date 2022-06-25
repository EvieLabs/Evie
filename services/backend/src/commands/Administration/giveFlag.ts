import { UserFlags } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "giveflag",
  description: "Grant a user flag to a user",
  preconditions: ["OwnerOnly"],
})
export class GiveFlag extends Command {
  public override async messageRun(message: Message, args: Args) {
    const user = await args.pick("user").catch(() => message.author);
    const flagArg = await args.pick("string").catch(() => {
      throw "Failed to pick a flag.";
    });

    function getFlag() {
      switch (flagArg) {
        case "dev":
          return UserFlags.CONTRIBUTOR;
        default:
          throw "Failed to pick a flag.";
      }
    }

    const evieUser = await this.container.client.prisma.evieUser.update({
      where: {
        id: user.id,
      },
      data: {
        flags: { push: getFlag() },
      },
    });

    await message.reply(
      [
        "Done! New User:",
        "```json",
        JSON.stringify(evieUser, null, 2),
        "```",
      ].join("\n")
    );
  }
}
