import { getAstralGuildConfig } from "@astral/utils";
import { inlineCode } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "editastralguild",
  description: "Edit a astral guild",
  preconditions: ["OwnerOnly"],
})
export class EditAstralGuild extends Command {
  public override async messageRun(message: Message, args: Args) {
    const guildId = await args.pick("string").catch(() => message.guildId);
    const configOption = await args.pick("string").catch(() => null);
    const configValue =
      message.cleanContent.split(" ").slice(3).join(" ") || null;
    const looksLikeJson =
      configValue &&
      (configValue.startsWith("{") || configValue.startsWith("[")) &&
      (configValue.endsWith("}") || configValue.endsWith("]"));

    console.log(configValue);

    if (!guildId) throw "You must provide a guild ID!";

    const config = await getAstralGuildConfig(guildId);

    if (!config) throw "No config found for that guild!";

    if (!configOption) {
      return void (await message.reply(
        [
          `Astral Guild Config for ${inlineCode(guildId)}:`,
          "```json",
          JSON.stringify(config, null, 2),
          "```",
        ].join("\n")
      ));
    }

    if (!configValue) throw "You must provide a value!";

    const newConfig = await this.container.client.prisma.astralConfig
      .update({
        where: {
          guildId: guildId,
        },
        data: {
          [configOption]: looksLikeJson ? JSON.parse(configValue) : configValue,
        },
      })
      .catch((e) => {
        throw [
          "Failed to update!",
          "```js",
          JSON.stringify(e, null, 2),
          "```",
        ].join("\n");
      });

    return void (await message.reply(
      [
        "Done! New Astral Guild Config:",
        "```json",
        JSON.stringify(newConfig, null, 2),
        "```",
      ].join("\n")
    ));
  }
}
