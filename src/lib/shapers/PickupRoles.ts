import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from "discord.js";

export async function ShapePickupRolesToChoices(
  interaction: AutocompleteInteraction
): Promise<ApplicationCommandOptionChoiceData[]> {
  if (!interaction.guild)
    return [
      {
        name: "No guild",
        value: "no_guild",
      },
    ];

  const pickupRoles = await interaction.client.prisma.pickupRole.findMany({
    where: {
      guildID: interaction.guild.id,
    },
  });

  const roles = await Promise.all(
    pickupRoles.map(async (pickupRole) => {
      return (
        interaction.guild?.roles.cache.get(pickupRole.roleID) ??
        (await interaction.guild?.roles.fetch(pickupRole.roleID))
      );
    })
  );
  const query = interaction.options.getString("query") ?? "";

  if (roles.length == 0) {
    return [
      {
        name: "Could not find any roles",
        value: "create",
      },
    ];
  }

  const filteredRoles = roles
    .filter(
      (role) =>
        role?.name.toLowerCase().includes(query.toLowerCase()) ||
        role?.id.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((role) => ({
      name: role?.name ?? "Unknown",
      id: role?.id ?? "Unknown",
    }));

  return filteredRoles.map((role) => {
    return {
      name: role.name,
      value: role.id,
    };
  });
}
