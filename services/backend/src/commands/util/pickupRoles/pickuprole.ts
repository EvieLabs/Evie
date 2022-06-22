import { StatusEmbed } from "#root/classes/EvieEmbed";
import { ShapePickupRolesToChoices } from "#root/lib/shapers/PickupRoles";
import { registeredGuilds } from "@evie/config";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
@ApplyOptions<Command.Options>({
  description: "Pick up a pick-up-able role.",
  preconditions: ["GuildOnly"],
  requiredClientPermissions: ["MANAGE_ROLES"],
})
export class PickupRole extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild())
      throw await resolveKey(interaction, "errors:notInCachedGuild");
    if (!interaction.member || !interaction.guildId || !interaction.guild)
      throw null;

    await interaction.deferReply({ ephemeral: true });
    const query = interaction.options.getString("query");

    const { guild } = interaction;
    const { client } = this.container;

    if (!query) throw await resolveKey(interaction, "errors:queryMissing");

    const pickUpRole = await client.prisma.pickupRole.findFirst({
      where: {
        roleID: query,
        guildID: interaction.guildId,
      },
    });

    if (!pickUpRole)
      throw await resolveKey(
        interaction,
        "commands/util/pickuprole:roleNotInDatabase"
      );

    const role =
      guild?.roles.cache.get(pickUpRole.roleID) ??
      (await guild?.roles.fetch(pickUpRole.roleID));

    if (!role)
      throw await resolveKey(
        interaction,
        "commands/util/pickuprole:roleNotInGuild"
      );

    const removeRole = interaction.member.roles.cache.has(role.id);

    removeRole
      ? await interaction.member.roles.remove(role).catch(async () => {
          throw await resolveKey(
            interaction,
            "commands/util/pickuprole:failedToRemoveRole",
            {
              role: role,
            }
          );
        })
      : await interaction.member.roles.add(role).catch(async () => {
          throw await resolveKey(
            interaction,
            "commands/util/pickuprole:failedToAddRole",
            {
              role: role,
            }
          );
        });

    interaction.editReply({
      embeds: [
        new StatusEmbed(
          true,
          await resolveKey(
            interaction,
            `commands/util/pickuprole:${
              removeRole ? "successRemove" : "successAdd"
            }`,
            {
              role: role,
            }
          )
        ),
      ],
    });
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    await interaction.respond(await ShapePickupRolesToChoices(interaction));
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: "query",
            description: "Role to pickup",
            type: "STRING",
            autocomplete: true,
            required: true,
          },
        ],
      },
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
