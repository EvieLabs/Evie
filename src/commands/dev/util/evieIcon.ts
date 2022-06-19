import { ApplyOptions } from "@sapphire/decorators";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { Args, Command } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "evieicon",
  description: "Upload an emoji to Evie Icons",
  preconditions: ["OwnerOnly"],
  aliases: ["ei"],
})
export class EvieIcon extends Command {
  public override async messageRun(message: Message, args: Args) {
    const emoji = await args.pick("emoji").catch(() => {
      throw "You must specify an emoji to upload.";
    });

    const emojiBuffer = await fetch(
      `https://cdn.discordapp.com/emojis/${emoji.id}.${
        emoji.animated ? "gif" : "png"
      }`,
      FetchResultTypes.Buffer
    );

    const evieIcons = await this.container.client.guilds.fetch(
      "971372192203952148"
    );

    const icon = await evieIcons.emojis.create(emojiBuffer, emoji.name || "_");

    const idChannel = await evieIcons.channels.fetch("971373746218729472");

    if (!(idChannel instanceof TextChannel)) throw "Couldn't find the channel.";

    const sentMessage = await idChannel.send(`\\${icon}`);

    await message.reply(
      `Uploaded ${icon} \`${icon}\` to [Evie Icons](${sentMessage.url}).`
    );
  }
}
