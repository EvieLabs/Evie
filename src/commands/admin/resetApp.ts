import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

export class ResetApp extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "reset app",
      aliases: ["reset"],
      description: "resets the application commands",
      preconditions: ["OwnerOnly"],
    });
  }

  public override async messageRun(message: Message) {
    const status = await message.reply(
      "Resetting global application commands.."
    );
    await message.client.application?.commands.set([]);
    await status.edit("Resetting per guild commands...");
    message.client.guilds.cache.forEach(async (guild) => {
      console.log(`Resetting commands for ${guild.name}...`);
      await message.client.application?.commands
        .set([], guild.id)
        .catch(console.error);
      console.log(`Reset commands for ${guild.name}`);
    });
    return await status.edit("Done!");
  }
}
