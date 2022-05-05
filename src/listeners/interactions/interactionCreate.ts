import lang from "#root/utils/lang";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Interaction } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: false,
  event: Events.InteractionCreate,
})
export class InteractionCreate extends Listener {
  public async run(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (
      interaction.customId.startsWith("reacord-") &&
      interaction.createdAt.getTime() <= interaction.client.startedAt.getTime()
    )
      return void interaction.reply({
        content: lang.reacordInteractionExpired,
      });
    return;
  }
}
