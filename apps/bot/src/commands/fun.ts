import { registeredGuilds } from "#utils/parsers/envUtils";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";
import fetch from "node-fetch";

export class Fun extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "shiba") {
      const res = await fetch(
        `http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const respros = await res.json();

      const dog = respros[0];

      interaction.reply(dog.toString());
    } else if (subcommand == "evie") {
      async function randomEvie() {
        const res = await fetch(
          `https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/evie.txt`
        );
        const pics: string[] = (await res.text()).trim().split("\n");
        return pics[Math.floor(Math.random() * pics.length)];
      }
      interaction.reply(await randomEvie());
    }
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription("Fun Commands")
          .addSubcommand((subcommand) =>
            subcommand
              .setName("evie")
              .setDescription("sends a picture of real life evie")
          )
          .addSubcommand((subcommand) =>
            subcommand
              .setName("shiba")
              .setDescription("much wow so cool very cute")
          ),
      {
        guildIds: registeredGuilds,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["954547161780088864"],
      }
    );
  }
}
