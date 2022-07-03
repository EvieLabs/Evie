import { captureException } from "@sentry/node";
import NodeCache from "node-cache";
import {
  Assistant as GAssistant,
  AssistantLanguage,
  AudioOutEncoding,
} from "nodejs-assistant";
import { googleAssistantCredentials } from "../utils/env";
import { Puppeteer } from "./Puppeteer";

export class Assistant {
  private assistant: GAssistant | null = null;
  private cache = new NodeCache({
    stdTTL: 60 * 60,
  });

  public constructor() {
    if (!googleAssistantCredentials) return;
    this.assistant = new GAssistant(
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

  public async ask(query: string) {
    const cacheKey = query.toLowerCase();
    const cached = this.cache.get(cacheKey) as {
      image: Buffer;
      audio: Buffer | undefined;
    };

    if (cached) return cached;

    try {
      const { image, audio } = await this.fetchAsk(query);
      this.cache.set(cacheKey, { image, audio });
      return { image, audio };
    } catch (e) {
      throw e;
    }
  }

  private async fetchAsk(query: string) {
    if (!this.assistant) throw new Error("Google Assistant not configured.");

    const response = await this.assistant.query(query, {
      audioOutConfig: {
        encoding: AudioOutEncoding.MP3,
        sampleRateHertz: 16000,
        volumePercentage: 100,
      },
    });

    if (!response.html) throw new Error("No response from Google Assistant.");

    try {
      const html = response.html.replace(
        "<html>",
        `<html style="background-image: url('https://evie.pw/assets/Banner.png')">`
      );
      const image = await Puppeteer.RenderHTML(html);
      return { image, audio: response.audio };
    } catch (e) {
      captureException(e);
      throw e;
    }
  }
}
