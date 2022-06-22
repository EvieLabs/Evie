import {
  ApplicationCommandRegistry,
  Command,
  container,
  Events,
} from "@sapphire/framework";
import type {
  ApplicationCommand,
  ApplicationCommandManager,
  Collection,
} from "discord.js";

export const registries = new Map<string, ApplicationCommandRegistry>();

export async function getNeededRegistryParameters() {
  const { client } = container;

  if (!client.application) throw new Error("No application found.");

  const applicationCommands = client.application.commands;
  const globalCommands = await applicationCommands.fetch();
  const guildCommands = await fetchGuildCommands(applicationCommands);

  return {
    applicationCommands,
    globalCommands,
    guildCommands,
  };
}

async function fetchGuildCommands(commands: ApplicationCommandManager) {
  const map = new Map<string, Collection<string, ApplicationCommand>>();

  for (const [guildId, guild] of commands.client.guilds.cache.entries()) {
    try {
      const guildCommands = await commands.fetch({ guildId });
      map.set(guildId, guildCommands);
    } catch (err) {
      if (
        !container.client.options.preventFailedToFetchLogForGuildIds?.includes(
          guildId
        )
      ) {
        container.logger.warn(
          `ApplicationCommandRegistries: Failed to fetch guild commands for guild "${guild.name}" (${guildId}).`,
          'Make sure to authorize your application with the "applications.commands" scope in that guild.'
        );
      }
    }
  }

  return map;
}

export async function handleRegistryAPICalls() {
  const commandStore = container.stores.get("commands");

  for (const command of commandStore.values()) {
    try {
      await command.registerApplicationCommands(
        command.applicationCommandRegistry
      );
    } catch (error) {
      emitRegistryError(error, command);
    }
  }

  const { applicationCommands, globalCommands, guildCommands } =
    await getNeededRegistryParameters();

  for (const registry of registries.values()) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    await registry["runAPICalls"](
      applicationCommands,
      globalCommands,
      guildCommands
    );

    const piece = registry.command;

    if (piece) {
      for (const nameOrId of piece.applicationCommandRegistry
        .chatInputCommands) {
        commandStore.aliases.set(nameOrId, piece);
      }

      for (const nameOrId of piece.applicationCommandRegistry
        .contextMenuCommands) {
        commandStore.aliases.set(nameOrId, piece);
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function emitRegistryError(error: unknown, command: Command<any, any>) {
  const { name, location } = command;
  const { client, logger } = container;

  if (client.listenerCount(Events.CommandApplicationCommandRegistryError)) {
    client.emit(Events.CommandApplicationCommandRegistryError, error, command);
  } else {
    logger.error(
      `Encountered error while handling the command application command registry for command "${name}" at path "${location.full}"`,
      error
    );
  }
}
