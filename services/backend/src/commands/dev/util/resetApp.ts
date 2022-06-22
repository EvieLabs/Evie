import { handleRegistryAPICalls } from "#utils/misc/handleRegistryAPICalls";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

export class ResetApp extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "resetapp",
      aliases: ["reset"],
      description: "resets the application commands",
      preconditions: ["OwnerOnly"],
    });
  }

  public override async messageRun(message: Message) {
    const status = await message.reply(
      "Resetting global application commands.."
    );
    try {
      await message.client.application?.commands.set([]);
      await status.edit("Resetting per guild commands...");
      message.client.guilds.cache.forEach(async (guild) => {
        this.container.logger.info(`Resetting commands for ${guild.name}...`);
        await message.client.application?.commands
          .set([], guild.id)
          .catch(this.container.logger.error);
        this.container.logger.info(`Reset commands for ${guild.name}`);
      });
      await status.edit("Re-linking commands...");
      await handleRegistryAPICalls();
      return await status.edit("Done!");
    } catch (err) {
      this.container.logger.error(err);
      return await status.edit(`Error check console!`);
    }
  }
}
