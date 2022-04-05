import extractHostname from "#root/utils/parsers/extractHostname";
import * as Sentry from "@sentry/node";
import axios from "axios";
import type { Message } from "discord.js";
import { EventDispatcher } from "strongly-typed-events";
import { client } from "..";
import { LogEmbed } from "./LogEmbed";

export class Phisherman {
  constructor() {
    this.onPhish.subscribe(async (_, phish) => {
      if (!phish.message.guild) return;

      const embed = new LogEmbed(`phisherman.gg integration`)
        .setColor("#4e73df")
        .setAuthor({
          name: `${phish.message.author.tag} (${phish.message.author.id})`,
          iconURL: phish.message.author.displayAvatarURL(),
        })
        .setDescription(
          `${
            phish.successfullyDeleted ? "Deleted" : "Failed to delete"
          } a message with a known phishing link`
        )
        .addField(
          "Message",
          `${phish.message.content} ${
            phish.successfullyDeleted
              ? `[Jump to message](${phish.message.url})`
              : `[Jump to context](${phish.message.url})`
          }`
        )
        .addField("Triggered Link", phish.url);

      await client.guildLogger.log(phish.message.guild, embed);
    });
  }

  private readonly TOKEN = process.env.PHISHERMAN_TOKEN
    ? process.env.PHISHERMAN_TOKEN
    : null;

  private _onPhishDetected = new EventDispatcher<Phisherman, FoundPhishEvent>();
  private readonly URL_REGEX =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  public get onPhish() {
    return this._onPhishDetected.asEvent();
  }

  public async scan(message: Message) {
    const links = message.content.match(this.URL_REGEX);
    if (!links) return;
    links.forEach(async (element) => {
      if (!(await this.checkDomain(extractHostname(element)))) return;

      try {
        await message.delete();
        this._onPhishDetected.dispatch(this, {
          successfullyDeleted: true,
          message,
          url: element,
        });
      } catch (error) {
        Sentry.captureException(error);
        this._onPhishDetected.dispatch(this, {
          successfullyDeleted: false,
          message,
          url: element,
        });
      }
    });
  }

  private async checkDomain(domain: string): Promise<boolean> {
    if (!this.TOKEN) {
      console.log(
        "WARNING `PHISHERMAN_TOKEN` IS NULL! PHISHING SCAMS WILL BE NOT SCANNED!"
      );
      return false;
    }
    const res = await axios.get(
      `https://api.phisherman.gg/v2/domains/check/${domain}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.TOKEN}`,
        },
      }
    );

    const json = await res.data;

    return json.verifiedPhish;
  }
}

type FoundPhishEvent = {
  readonly successfullyDeleted: boolean;
  readonly message: Message;
  readonly url: string;
};
