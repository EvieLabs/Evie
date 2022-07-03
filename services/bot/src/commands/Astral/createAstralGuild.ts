import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "createastralguild",
  description: "Create a astral guild",
  preconditions: ["OwnerOnly"],
})
export class CreateAstralGuild extends Command {
  public override async messageRun(message: Message, args: Args) {
    const guildId = await args.pick("string").catch(() => message.guildId);

    if (!guildId) throw "You must provide a guild ID!";

    const config = await this.container.client.prisma.astralConfig.create({
      data: {
        guildId,
      },
    });

    await message.reply(
      [
        "Done! New Astral Guild Config:",
        "```json",
        JSON.stringify(config, null, 2),
        "```",
      ].join("\n")
    );
  }
}
