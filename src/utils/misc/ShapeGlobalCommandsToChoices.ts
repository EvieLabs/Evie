import { container } from "@sapphire/framework";
import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from "discord.js";

export default async function (
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> {
  const commands =
    container.client.application?.commands.cache ??
    (await container.client.application?.commands.fetch());
  const query = interaction.options.getString("query") ?? "";

  return commands
    ? commands
        .map((command) => ({
          name: command.name,
          value: command.id,
        }))
        .filter((command) =>
          command.name.toLowerCase().includes(query.toLowerCase())
        )
    : [
        {
          name: "No commands found",
          value: "none",
        },
      ];
}
