import { googleAssistantCredentials, registeredGuilds } from "@evie/config";
import { RenderHTML } from "@evie/puppeteer";
import {
  ApplicationCommandRegistry,
  Command,
  RegisterBehavior,
} from "@sapphire/framework";
import { captureException } from "@sentry/node";
import { CommandInteraction, MessageAttachment } from "discord.js";
import {
  Assistant,
  AssistantLanguage,
  AudioOutEncoding,
} from "nodejs-assistant";

export class Google extends Command {
  private assistant: Assistant | null = null;

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "Google",
      description: "Talk to the Google Assistant.",
    });
    if (!googleAssistantCredentials) return;
    this.assistant = new Assistant(
      /* required credentials */ {
        type: "authorized_user",
        client_id: googleAssistantCredentials.client_id,
        client_secret: googleAssistantCredentials.client_secret,
        refresh_token: googleAssistantCredentials.refresh_token,
      },
      /* additional, optional options */ {
        locale: AssistantLanguage.ENGLISH, // Defaults to AssistantLanguage.ENGLISH (en-US)
        deviceId: "your device id",
        deviceModelId: "teamevie-evie-zfe5t2",
      }
    );
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    if (!this.assistant) throw "Google Assistant not configured.";

    const query = interaction.options.getString("query");

    if (!query) return;

    await interaction.deferReply();

    const response = await this.assistant.query(query, {
      audioOutConfig: {
        encoding: AudioOutEncoding.MP3,
        sampleRateHertz: 16000,
        volumePercentage: 100,
      },
    });

    const files: MessageAttachment[] = [];

    if (response.html) {
      try {
        const html = response.html.replace(
          "<html>",
          `<html style="background-image: url('https://evie.pw/assets/Banner.png')">`
        );
        const image = await RenderHTML(html);
        files.push(new MessageAttachment(image, "image.png"));
      } catch (e) {
        this.container.logger.error(e);
        captureException(e);
      }
    }

    response.audio &&
      files.push(new MessageAttachment(response.audio, "audio.mp3"));

    interaction.editReply({
      content: files.length === 0 ? "There was an error owo." : undefined,
      files: files,
    });
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
            description: "Query to send to the Google Assistant",
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
