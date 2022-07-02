import { removeIndents } from "#root/utils/builders/stringBuilder";
import { time } from "@discordjs/builders";
import { EvieEmbed } from "@evie/internal";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command } from "@sapphire/framework";
import { Message, SnowflakeUtil } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Compare two snowflakes.",
  name: "snowflakeCompare",
  aliases: ["snowflakecmp", "sc", "sfcmp"],
})
export class SnowflakeCompare extends Command {
  public override async messageRun(message: Message, args: Args) {
    const snowflake1 = SnowflakeUtil.deconstruct(
      await args.pick("string").catch(() => {
        throw "Missing snowflake.";
      })
    );
    const snowflake2 = SnowflakeUtil.deconstruct(
      await args.pick("string").catch(() => {
        throw "Missing snowflake to compare to.";
      })
    );

    return void message.reply({
      embeds: [
        new EvieEmbed() //
          .setDescription(
            removeIndents(
              `**Snowflake 1**: ${time(snowflake1.date)} 
               **Snowflake 2**: ${time(snowflake2.date)}
               **Time Difference**: ${
                 snowflake2.date.getTime() - snowflake1.date.getTime()
               }ms
               `
            )
          ),
      ],
    });
  }
}
