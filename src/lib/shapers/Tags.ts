import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from "discord.js";

export async function ShapeTagsToChoices(
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> {
  if (!interaction.guild)
    return [
      {
        name: "No guild",
        value: "no_guild",
      },
    ];
  const tagData = await interaction.client.db.FetchTags(interaction.guild);
  const query = interaction.options.getString("query") ?? "";

  if (tagData.length == 0) {
    return [
      {
        name: "📌Create a new tag with /createtag",
        value: "create",
      },
    ];
  }

  const tags = tagData
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase()) ||
        tag.content.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((tag) => ({
      name: tag.name,
      id: tag.id,
    }));

  return tags.map((tag) => {
    return {
      name: `📌${tag.name}`,
      value: tag.id,
    };
  });
}
