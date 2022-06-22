import { EvieEmbed } from "#root/classes/EvieEmbed";
import { Emojis } from "#root/Enums";
import { removeIndents } from "#root/utils/builders/stringBuilder";
import { inlineCode, time } from "@discordjs/builders";
import { registeredGuilds } from "@evie/config";
import type {
  OfflineServerResponse,
  OnlineServerResponse,
} from "@evie/interfaces";
import { minecraftStyling, RenderHTML } from "@evie/puppeteer";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { blue, green, magenta } from "colorette";
import { CommandInteraction, Message, MessageAttachment } from "discord.js";

export class Ping extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "ping",
      aliases: ["pong"],
      description:
        "Use the text command to check the bot's latency. Use the slash command to ping anything.",
    });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    const destination = interaction.options.getString("destination");

    if (!destination) throw "You must specify a destination to ping.";

    await interaction.deferReply();

    const mcServer = await this.pingMinecraftServer(destination);

    if (mcServer) return void this.handleMinecraftServer(mcServer, interaction);

    throw "Couldn't resolve your destination. (currently only supporting Minecraft servers until we make our proxy service)";
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
          const image = await RenderHTML(
            [minecraftStyling, html.join("<br />")].join("\n"),
            {
              width: 640,
              height: 80,
              omitBackground: true,
            }
          );

          files.push(new MessageAttachment(image, `motd.png`));
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

  public override async messageRun(message: Message) {
    const msg = await message.reply("**!** `e v i e` **!**");

    const content = removeIndents(`\`\`\`ansi
    ${green("Bot Latency")}: ${magenta(
      Math.round(this.container.client.ws.ping)
    )}
    ${blue("API Latency")}: ${magenta(
      msg.createdTimestamp - message.createdTimestamp
    )}
    \`\`\``);

    return msg.edit(content);
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: '"Ping" literally anything.',
        options: [
          {
            name: "destination",
            description:
              "The destination to ping (Minecraft Server, Website, IP, etc.)",
            type: "STRING",
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
