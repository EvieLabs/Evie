/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import extractHostname from "#root/utils/parsers/extractHostname";
import axios from "axios";
import type { Message } from "discord.js";
import { EventDispatcher } from "strongly-typed-events";

export class Phisherman {
  private readonly TOKEN = process.env.PHISHERMAN_TOKEN
    ? `Bearer :${process.env.PHISHERMAN_TOKEN}`
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
        });
      } catch (error) {
        this._onPhishDetected.dispatch(this, {
          successfullyDeleted: false,
          message,
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
          Authorization: this.TOKEN,
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
};
