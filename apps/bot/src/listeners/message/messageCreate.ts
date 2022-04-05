import { botAdmins } from "#root/utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Message, Permissions } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.MessageCreate,
})
export class MessageCreate extends Listener {
  public async run(message: Message) {
    if (message.author.bot || !message.inGuild()) return;

    message.client.phisherman.scan(message);
    message.client.blockedWords.scan(message);

    if (!message.guild.me) return;

    if (
      botAdmins.includes(message.author.id) &&
      message.content == "e!resetapp" &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
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
      await status.edit("Done!");
    }
  }
}
