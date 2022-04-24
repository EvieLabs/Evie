import { registeredGuilds } from "#utils/parsers/envUtils";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApplicationCommandRegistry,
  ChatInputCommand,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import axios from "axios";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<ChatInputCommand.Options>({
  description: "Fun Commands",
})
export class Fun extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand == "shiba") {
      const res = await axios.get(
        `http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      interaction.reply(res.data[0]);
    } else if (subcommand == "evie") {
      async function randomEvie() {
        const res = await axios.get(
          `https://raw.githubusercontent.com/twisttaan/AxolotlBotAPI/main/evie.txt`
        );
        const pics: string[] = (await res.data).trim().split("\n");
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
          .setDescription(this.description)
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
