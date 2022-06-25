import { EvieEmbed } from "#root/classes/EvieEmbed";
import { Emojis } from "#root/Enums";
import { inlineCode, time } from "@discordjs/builders";
import { registeredGuilds } from "@evie/config";
import type {
  OfflineServerResponse,
  OnlineServerResponse,
} from "@evie/interfaces";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { CommandInteraction, MessageAttachment } from "discord.js";

export class MinecraftServer extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "mcserver",
      description: "View an overview of a Minecraft server.",
    });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const destination = interaction.options.getString("destination");

    if (!destination) throw "You must specify a destination to ping.";

    const ephemeral = !interaction.options.getBoolean("show") ?? false;

    await interaction.deferReply({ ephemeral });

    const mcServer = await this.pingMinecraftServer(destination);

    if (mcServer)
      return void (await this.handleMinecraftServer(mcServer, interaction));

    throw "Couldn't resolve your destination. Does this server exist? Is it offline?";
  }

  private async handleMinecraftServer(
    mcServer: OnlineServerResponse | OfflineServerResponse,
    interaction: CommandInteraction
  ) {
    const { hostname } = mcServer;

    const embeds: EvieEmbed[] = [];
    const files: MessageAttachment[] = [];

    switch (mcServer.online) {
      case true: {
        const { motd, icon, ip, port, protocol, debug } = mcServer;
        const { cachetime } = debug;
        const { html } = motd;

        const embed = new EvieEmbed();

        try {
          const { data: image } = await this.container.client.park.post(
            "/minecraft/motd",
            {
              lines: html,
            },
            {
              responseType: "arraybuffer",
            }
          );

          files.push(new MessageAttachment(Buffer.from(image), `motd.png`));
          embed.setImage(`attachment://motd.png`);

          const iconBuffer = Buffer.from(
            icon.replace("data:image/png;base64,", ""),
            "base64"
          );
          files.push(new MessageAttachment(iconBuffer, `icon.png`));
          embed.setThumbnail(`attachment://icon.png`);
        } catch (e) {
          captureException(e);
        }

        embed.setTitle(hostname);

        const basicInfo = [
          `Players: ${inlineCode(
            `${mcServer.players.online}/${mcServer.players.max}`
          )}`,
          `Hostname: ${inlineCode(hostname)}`,
          `Version: ${inlineCode(mcServer.version)}`,
        ].map((line) => `${Emojis.bulletPoint} ${line}`);

        const advancedInfo = [
          `IP: ${inlineCode(ip)}`,
          `Port: ${inlineCode(port.toString())}`,
          `Protocol Version: ${inlineCode(protocol.toString())}`,
          `Data from: ${
            cachetime === 0
              ? time(new Date(), "R")
              : time(new Date(cachetime * 1000), "R")
          } 
        `,
        ].map((line) => `${Emojis.bulletPoint} ${line}`);

        embed.addFields([
          {
            name: "Basic Info",
            value: basicInfo.join("\n"),
          },
          {
            name: "Advanced Info",
            value: advancedInfo.join(`\n`),
          },
        ]);

        embeds.push(embed);
        break;
      }
      case false: {
        throw "Couldn't resolve your destination. Does this server exist? Is it offline?";
      }
    }

    await interaction.editReply({ embeds, files });
  }

  private async pingMinecraftServer(
    hostname: string
  ): Promise<OnlineServerResponse | OfflineServerResponse | null> {
    try {
      const data = await fetch<OnlineServerResponse | OfflineServerResponse>(
        `https://api.mcsrvstat.us/2/${hostname}`,
        FetchResultTypes.JSON
      );
      return data.online
        ? (data as OnlineServerResponse)
        : (data as OfflineServerResponse);
    } catch (e) {
      return null;
    }
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
            name: "destination",
            description:
              "The hostname or IP of the server to ping. (e.g. hypixel.net)",
            type: "STRING",
            required: true,
          },
          {
            name: "show",
            description: "Send the message non-ephemerally",
            type: "BOOLEAN",
            required: false,
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
